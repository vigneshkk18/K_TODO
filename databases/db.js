import PouchDB from 'pouchdb';

export default class DB {
	constructor(name){
		this.db = new PouchDB(name);
	}
	async getAllNotes(){
		let allNotes = await this.db.allDocs({include_docs: true});
		return allNotes;
	}
	async createNote(note){
		note.createdAt = new Date();
		
		const res = await this.db.post({...note});
		return res;
	}
}