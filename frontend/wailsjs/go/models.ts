export namespace database {
	
	export class ColumnType {
	    name: string;
	    nullable: boolean;
	    length: number;
	    database_type: string;
	    precison: number;
	    scale: number;
	    scan_type: string;
	
	    static createFrom(source: any = {}) {
	        return new ColumnType(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.nullable = source["nullable"];
	        this.length = source["length"];
	        this.database_type = source["database_type"];
	        this.precison = source["precison"];
	        this.scale = source["scale"];
	        this.scan_type = source["scan_type"];
	    }
	}
	export class Results {
	    error: any;
	    headers: string[];
	    rows: any[];
	    col_types: ColumnType[];
	
	    static createFrom(source: any = {}) {
	        return new Results(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	        this.headers = source["headers"];
	        this.rows = source["rows"];
	        this.col_types = this.convertValues(source["col_types"], ColumnType);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

