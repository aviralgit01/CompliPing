import { NextResponse } from "next/server";

export function successResponse(
  data: any,
  message = "Success",
  status = 200,
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(pagination && { pagination }), // only include if provided
    },
    { status }
  );
}

export function errorResponse(error:any =null,message = "Something Went Wrong", status:any) {
  return NextResponse.json(
    {
      success: false,
      message:message,
      error:error,
      data:null
    },
    {status}
  )
}

