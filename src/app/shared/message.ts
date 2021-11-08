export interface IMessage{
    messageType:MessageType,
    message:string
}

export enum MessageType{
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING",
    SUCCESS = "SUCCESS"
  }