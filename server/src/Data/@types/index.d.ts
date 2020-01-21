interface IDBUser {
  id: number;
  email: string;
  name: string;
}

interface IDBCommit {
  id: number;
  users_id: number;
  date: string;
  additions: number;
  deletions: number;
}

interface IInsertDataResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}
