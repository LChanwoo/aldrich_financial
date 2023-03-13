import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransactionDto {

  @IsNotEmpty()
  @IsString()
  public coinName: string;
  
  @IsNotEmpty ()
  @IsString()
  public transactionType: string;

  @IsNotEmpty()
  @IsNumber()
  public amount: number;
  
  @IsNotEmpty()
  @IsNumber()
  public price: number;

}