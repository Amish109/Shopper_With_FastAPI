 class ApiError extends Error{
    constructor(
        status,
        message,
        data={},
        success=false
    ){
        super(message)
        this.status=status;
        this.responseText=this.message;
        this.data=data;
        this.success=success;
    }
}
export {ApiError}
//To pass something to parent we use super()