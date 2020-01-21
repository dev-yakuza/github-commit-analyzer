import Axios from 'axios';
import ENV from '../env';

const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const strMonth = ('0' + month).slice(-2);
  const strDay = ('0' + day).slice(-2);

  return `${year}-${strMonth}-${strDay}`;
};
const getUserInfo = (userName: string): Promise<IUserInfo> => {
  return new Promise((resolve, reject) => {
    const url: string = `https://api.github.com/users/${userName}`;
    Axios.get(url, {
      headers: {
        Authorization: `token ${ENV.token}`,
      },
    })
      .then(response => {
        console.log('success');
        resolve(response.data);
      })
      .catch(error => {
        console.log(`[ERROR] ${url}`);
        console.log(error.response.status);
        console.log(error.response.message);
        reject(error.response.data.message);
      });
  });
};

const getRepoInfo = (owner: string, repos: string): Promise<object> => {
  return new Promise((resolve, reject) => {
    const url: string = `https://api.github.com/repos/${owner}/${repos}`;
    Axios.get(url, {
      headers: {
        Authorization: `token ${ENV.token}`,
      },
    })
      .then(response => {
        console.log('success');
        resolve(response.data);
      })
      .catch(error => {
        console.log(`[ERROR] ${url}`);
        console.log(error.response.status);
        console.log(error.response.message);
        reject(error.response.data.message);
      });
  });
};

const getCommitsInfoInRepo = async (
  owner: string,
  repos: string,
  since: string | Date,
  page?: string
): Promise<Array<ICommitInfo>> => {
  let result: Array<ICommitInfo> = [];

  let date = since;
  if (typeof since === 'object') {
    date = getDateString(since);
  }
  let url = `https://api.github.com/repos/${owner}/${repos}/commits?since=${date}T00:00:00`;
  if (page) {
    url += `&page=${page}`;
  }
  try {
    const response = await Axios.get(url, {
      headers: {
        Authorization: `token ${ENV.token}`,
      },
    });
    result = [...response.data];

    if (response.headers.link) {
      const match = response.headers.link.match(/page=(.*)>; rel="next"/);
      if (match && match.length > 1) {
        const data = await getCommitsInfoInRepo(owner, repos, since, match[1]);
        result = [...result, ...data];
      }
    }

    result.map((commit: ICommitInfo, index: number) => {
      console.log(`${index}: ${commit.sha}`);
    });
    return result;
  } catch (error) {
    console.log(`[ERROR] ${url}`);
    console.log(error.response.status);
    console.log(error.response.message);
    return null;
  }
};
// const getCommitsInfoInRepo = (
//   owner: string,
//   repos: string,
//   since: string | Date,
//   page?: string
// ): Promise<Array<ICommitInfo>> => {
//   if (page === undefined) {
//     result = [];
//   }
//   return new Promise((resolve, reject) => {
//     let date = since;
//     if (typeof since === 'object') {
//       date = getDateString(since);
//     }
//     let url = `https://api.github.com/repos/${owner}/${repos}/commits?since=${date}T00:00:00`;
//     if (page) {
//       url += `&page=${page}`;
//     }
//     Axios.get(url, {
//       headers: {
//         token: ENV.token,
//       },
//     })
//       .then(response => {
//         result = [...result, ...response.data];

//         if (response.headers.link) {
//           const match = response.headers.link.match(/page=(.*)>; rel="next"/);
//           if (match && match.length > 1) {
//             return getCommitsInfoInRepo(owner, repos, since, match[1]);
//           }
//         }

//         result.map((commit: ICommitInfo, index: number) => {
//           console.log(`${index}: ${commit.sha}`);
//         });
//         resolve(result);
//       })
//       .catch(error => {
//         console.log(`[ERROR] ${url}`);
//         console.log(error.response.status);
//         console.log(error.response.message);
//         reject(error.response.data.message);
//       });
//   });
// };

const getCommitInfoInRepo = (
  owner: string,
  repos: string,
  ref: string
): Promise<ICommitDetails> => {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${owner}/${repos}/commits/${ref}`;
    console.log('getCommitInfoInRepo: ', url);
    Axios.get(url, {
      headers: {
        Authorization: `token ${ENV.token}`,
      },
    })
      .then(response => {
        console.log('success');
        resolve(response.data);
      })
      .catch(error => {
        console.log(`[ERROR] ${url}`);
        console.log(error.response.status);
        console.log(error.response.message);
        reject(error.response.data.message);
      });
  });
};

// getUserInfo('dev-yakuza')
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// getRepoInfo('dev-yakuza', 'react-native-image-box')
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// getCommitsInfoInRepo(OWNER, REPOSITORY, '2020-01-10')
// getCommitsInfoInRepo(OWNER, REPOSITORY, '2020-01-21')
//   .then(data => {
//     console.log('result');
//     // console.log(data);
//     data.map((commit: ICommitInfo, index: number) => {
//       console.log(`${index}: ${commit.sha}`);
//       const sha = commit.sha;
//       getCommitInfoInRepo(OWNER, REPOSITORY, sha)
//         .then(data => {
//           console.log('name: ' + data.commit.author.email);
//           console.log('name: ' + data.commit.author.name);
//           console.log('date: ' + data.commit.author.date);
//           console.log('total: ' + data.stats.total);
//           console.log('additions: ' + data.stats.additions);
//           console.log('deletions: ' + data.stats.deletions);

//           insertData(
//             sha,
//             data.commit.author.email,
//             data.commit.author.name,
//             data.commit.author.date,
//             data.stats.additions,
//             data.stats.deletions
//           );
//         })
//         .catch(error => {
//           console.log(error);
//         });
//     });
//   })
//   .catch(error => {
//     console.log(error);
//   });

// getCommitInfoInRepo(
//   OWNER,
//   REPOSITORY,
//   'b9a9e8aed6c09b267d648aa88ffeff21751d8d87'
// )
//   .then(data => {
//     console.log('name: ' + data.commit.author.name);
//     console.log('date: ' + data.commit.author.date);
//     console.log('total: ' + data.stats.total);
//     console.log('additions: ' + data.stats.additions);
//     console.log('deletions: ' + data.stats.deletions);
//   })
//   .catch(error => {
//     console.log(error);
//   });

export default {
  getUserInfo,
  getRepoInfo,
  getCommitsInfoInRepo,
  getCommitInfoInRepo,
};
