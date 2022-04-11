export class User {
    constructor(
        public email="",
        public name="",
        public password="",
        public isAdmin=false,
        public adminToken=""
        ) { }
}
