import DB from '../DB';

const db = new DB();

const insertUser = async (email: string, name: string): Promise<number> => {
  const rows: Array<IDBUser> = await db.query(`
    SELECT
      *
    FROM
      users
    WHERE 1=1
    AND email='${email}'
  `);

  if (rows && rows.length === 0) {
    const data: IInsertDataResult = await db.query(`
      INSERT INTO
        users (email, name)
      VALUES ('${email}', '${name}')
    `);
    return data.insertId;
  }

  return rows[0].id;
};
const insertCommits = async (
  users_id: number,
  sha: string,
  date: string,
  additions: number,
  deletions: number
) => {
  const rows: Array<IDBUser> = await db.query(`
    SELECT
      *
    FROM
      commits
    WHERE 1=1
    AND users_id='${users_id}'
    AND sha='${sha}'
  `);

  if (rows && rows.length === 0) {
    const data: IInsertDataResult = await db.query(`
      INSERT INTO
        commits (users_id, sha, date, additions, deletions)
      VALUES ('${users_id}', '${sha}', '${date
      .replace('T', ' ')
      .replace('Z', '')}', '${additions}', '${deletions}')
    `);
    return data.insertId;
  }

  return rows[0].id;
};
const insertData = async (
  sha: string,
  email: string,
  name: string,
  date: string,
  additions: number,
  deletions: number
) => {
  const users_id = await insertUser(email, name);
  await insertCommits(users_id, sha, date, additions, deletions);
};

const getUserCommits = async (): Promise<Array<any>> => {
  try {
    const rows = await db.query(`
      SELECT
        commits.sha,
        users.email,
        users.name,
        commits.additions,
        commits.deletions,
        commits.date
      FROM
        commits
      LEFT JOIN users ON users.id = commits.users_id
      WHERE
        date >= NOW() - INTERVAL 10 DAY
    `);
    return rows;
  } catch (error) {
    return [];
  }
};

export default {
  insertData,
  getUserCommits,
};
