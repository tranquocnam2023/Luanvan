import type { fromJSON } from "postcss";

export class FunctionResponse{
    FunctionId:string;
    FunctionName:string;
    constructor({FunctionId,FunctionName}:{FunctionId:string;FunctionName:string}){
        this.FunctionId=FunctionId;
        this.FunctionName=FunctionName;
    }   

    static fromJSON(json:any): FunctionResponse {
        return new FunctionResponse({
            FunctionId: json.functionId,
            FunctionName: json.functionName
        });
    }
}