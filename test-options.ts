import {test as Base} from '@playwright/test';


export type TestOptions={
    autowaiturl: string;
}

export const test = Base.extend<TestOptions>({
    autowaiturl: [' ',{option:true}]    //default value is blank string
    
});