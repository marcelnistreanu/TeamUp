import { Error } from "./Error";
import { MessageResponse } from "./MessageResponse";

export class Result<T> {
  isSuccess: boolean;
  error: Error;
  message: MessageResponse;
  value: T;
};
