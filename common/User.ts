export class User {

	static fromAny(from: any): User {
		let u = new User();
		for(let key in from) (u as any)[key] = from[key];
		return u;
	}

    constructor(
        public email="",
        public name="",
        public password="",
        public isAdmin=false,
        public adminToken=""
        ) { }
}
