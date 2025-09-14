// PopupManager.ts
import { Page } from "@playwright/test";

export interface PopupConfig {
    closeKeywords?: string[];
    keepKeywords?: string[];
    logActivity?: boolean;
}

export class PopupManager {
    private readonly page: Page;
    private readonly config: PopupConfig;
    private keptPopups: Page[] = [];
    private closedPopupTitles: string[] = [];

    constructor(page: Page, config: PopupConfig = {}) {
        this.page = page;
        this.config = {
            closeKeywords: ['buy', 'side', 'advertisement', 'promo', 'ad', 'offer'],
            keepKeywords: ['pt list', 'inquiry', 'report', 'form', 'details', 'dashboard'],
            logActivity: true,
            ...config
        };
        
        this.setupPopupHandler();
    }

    private setupPopupHandler() {
        this.page.on('popup', async (popup) => {
            try {
                await popup.waitForLoadState('domcontentloaded');
                const title = await popup.title();
                const url = popup.url();

                if (this.config.logActivity) {
                    console.log(`[PopupManager] New popup detected: "${title}" - ${url}`);
                }

                if (this.shouldClosePopup(title)) {
                    if (this.config.logActivity) {
                        console.log(`[PopupManager] Closing unwanted popup: "${title}"`);
                    }
                    await popup.close();
                    this.closedPopupTitles.push(title);
                } else {
                    if (this.config.logActivity) {
                        console.log(`[PopupManager] Keeping popup open: "${title}"`);
                    }
                    this.keptPopups.push(popup);
                }
            } catch (error) {
                console.error('[PopupManager] Error handling popup:', error);
            }
        });
    }

    private shouldClosePopup(title: string): boolean {
        const titleLower = title.toLowerCase();
        
        // Check close keywords first
        if (this.config.closeKeywords?.some(keyword => 
            titleLower.includes(keyword.toLowerCase())
        )) {
            return true;
        }

        // If keep keywords are defined, only keep those
        if (this.config.keepKeywords && this.config.keepKeywords.length > 0) {
            return !this.config.keepKeywords.some(keyword => 
                titleLower.includes(keyword.toLowerCase())
            );
        }

        return false;
    }

    // Get all currently open popups
    getOpenPopups(): Page[] {
        return this.keptPopups.filter(popup => !popup.isClosed());
    }

    // Get popup by title pattern
    getPopupByTitle(titlePattern: string): Page | undefined {
        return this.getOpenPopups().find(popup => 
            popup.url().includes(titlePattern) || 
            // We can't access title() synchronously, so using URL as fallback
            popup.url().toLowerCase().includes(titlePattern.toLowerCase())
        );
    }

    // Get the most recent popup
    getLatestPopup(): Page | undefined {
        const openPopups = this.getOpenPopups();
        return openPopups[openPopups.length - 1];
    }

    // Switch to a specific popup
    async switchToPopup(popup: Page): Promise<void> {
        if (popup.isClosed()) {
            throw new Error('Cannot switch to closed popup');
        }
        await popup.bringToFront();
        if (this.config.logActivity) {
            console.log(`[PopupManager] Switched to popup: ${popup.url()}`);
        }
    }

    // Switch to latest popup
    async switchToLatestPopup(): Promise<Page> {
        const latestPopup = this.getLatestPopup();
        if (!latestPopup) {
            throw new Error('No open popups available');
        }
        await this.switchToPopup(latestPopup);
        return latestPopup;
    }

    // Switch back to main page
    async switchToMainPage(): Promise<void> {
        await this.page.bringToFront();
        if (this.config.logActivity) {
            console.log('[PopupManager] Switched back to main page');
        }
    }

    // Close a specific popup
    async closePopup(popup: Page): Promise<void> {
        if (!popup.isClosed()) {
            const title = await popup.title().catch(() => 'Unknown');
            await popup.close();
            this.closedPopupTitles.push(title);
            
            // Remove from kept popups array
            this.keptPopups = this.keptPopups.filter(p => p !== popup);
            
            if (this.config.logActivity) {
                console.log(`[PopupManager] Manually closed popup: "${title}"`);
            }
        }
    }

    // Close all open popups
    async closeAllPopups(): Promise<void> {
        const openPopups = this.getOpenPopups();
        for (const popup of openPopups) {
            await this.closePopup(popup);
        }
        if (this.config.logActivity) {
            console.log(`[PopupManager] Closed ${openPopups.length} popups`);
        }
    }

    // Close popups matching a title pattern
    async closePopupsWithTitle(titlePattern: string): Promise<number> {
        const openPopups = this.getOpenPopups();
        let closedCount = 0;

        for (const popup of openPopups) {
            try {
                const title = await popup.title();
                if (title.toLowerCase().includes(titlePattern.toLowerCase())) {
                    await this.closePopup(popup);
                    closedCount++;
                }
            } catch (error) {
                console.warn('[PopupManager] Could not get title for popup:', error);
            }
        }

        if (this.config.logActivity) {
            console.log(`[PopupManager] Closed ${closedCount} popups matching "${titlePattern}"`);
        }
        return closedCount;
    }

    // Get statistics
    getStats(): {
        openPopups: number;
        totalClosed: number;
        closedTitles: string[];
    } {
        return {
            openPopups: this.getOpenPopups().length,
            totalClosed: this.closedPopupTitles.length,
            closedTitles: [...this.closedPopupTitles]
        };
    }

    // Wait for a popup with specific title pattern
    async waitForPopup(titlePattern: string, timeout: number = 10000): Promise<Page> {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error(`Popup with title pattern "${titlePattern}" not found within ${timeout}ms`));
            }, timeout);

            const checkExisting = () => {
                const existingPopup = this.getPopupByTitle(titlePattern);
                if (existingPopup) {
                    clearTimeout(timeoutId);
                    resolve(existingPopup);
                    return true;
                }
                return false;
            };

            // Check existing popups first
            if (checkExisting()) return;

            // Listen for new popups
            const handler = async (popup: Page) => {
                try {
                    await popup.waitForLoadState('domcontentloaded');
                    const title = await popup.title();
                    if (title.toLowerCase().includes(titlePattern.toLowerCase())) {
                        clearTimeout(timeoutId);
                        this.page.off('popup', handler);
                        resolve(popup);
                    }
                } catch (error) {
                    // Continue waiting
                }
            };

            this.page.on('popup', handler);
        });
    }

    // Update configuration
    updateConfig(newConfig: Partial<PopupConfig>): void {
        Object.assign(this.config, newConfig);
        if (this.config.logActivity) {
            console.log('[PopupManager] Configuration updated:', newConfig);
        }
    }

    // Clean up resources
    async cleanup(): Promise<void> {
        await this.closeAllPopups();
        this.keptPopups = [];
        this.closedPopupTitles = [];
        if (this.config.logActivity) {
            console.log('[PopupManager] Cleanup completed');
        }
    }
}
