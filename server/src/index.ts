import express from 'express';
import env from './env';
import Github from './Github';
import Data from './Data';

class App {
  public application: express.Application;
  constructor() {
    this.application = express();
  }
}

const app = new App().application;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  );

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.get('/crawling', async (req: express.Request, res: express.Response) => {
  const { owner, repository } = env.git;
  let date = new Date();
  date.setDate(date.getDate() - 10);

  Github.getCommitsInfoInRepo(owner, repository, date)
    .then((data: Array<ICommitInfo>) => {
      console.log('result');
      // console.log(data);
      data.map(async (commit: ICommitInfo, index: number) => {
        console.log(`${index}: ${commit.sha}`);
        const sha = commit.sha;
        await Github.getCommitInfoInRepo(owner, repository, sha)
          .then(async data => {
            console.log('name: ' + data.commit.author.email);
            console.log('name: ' + data.commit.author.name);
            console.log('date: ' + data.commit.author.date);
            console.log('total: ' + data.stats.total);
            console.log('additions: ' + data.stats.additions);
            console.log('deletions: ' + data.stats.deletions);

            await Data.insertData(
              sha,
              data.commit.author.email,
              data.commit.author.name,
              data.commit.author.date,
              data.stats.additions,
              data.stats.deletions
            );

            res.send('Success!');
          })
          .catch(error => {
            console.log(error);
            res.send('Fail!');
          });
      });
    })
    .catch(error => {
      console.log(error);
      res.send('Fail!');
    });
});

app.get(
  '/users/commits',
  async (req: express.Request, res: express.Response) => {
    const data = await Data.getUserCommits();
    res.send(data);
  }
);

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
