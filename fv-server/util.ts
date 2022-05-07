export class Util{
    public static getParameter(param:string): string{
        if (param[0] == ':'){
            param = param.substring(1);
        }
        return param;
    }  
}