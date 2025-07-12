 class ApiResponse{
    constructor(
        status=200,
        message="Sucessful",
        data={},
        success=true
    ){
        this.status=status;
        this.responseText=message;
        this.data=data;
        this.success=success;
    }
}
export {ApiResponse}