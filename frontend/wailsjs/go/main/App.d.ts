// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {database} from '../models';
import {context} from '../models';

export function Connect(arg1:database.ConnectionDetails):Promise<void>;

export function ListSchemas():Promise<Array<string>>;

export function ListTables():Promise<Array<string>>;

export function Query(arg1:string):Promise<database.Results>;

export function RunTableCommand(arg1:string,arg2:string):Promise<void>;

export function SetContext(arg1:context.Context):Promise<void>;

export function TableCommands():Promise<Array<string>>;

export function Use(arg1:string):Promise<void>;
