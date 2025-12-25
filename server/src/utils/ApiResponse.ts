class ApiResponse {
  public success: boolean;
  constructor(
    public status: number,
    public message: string,
    public data: any = null
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

export default ApiResponse;
