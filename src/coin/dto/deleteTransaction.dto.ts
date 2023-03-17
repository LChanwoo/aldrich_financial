import { IsNotEmpty, IsString } from "class-validator";

export class DeleteTransactionDto {
  @IsNotEmpty()
  transactionId: number;
}