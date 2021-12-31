module.exports = class Organization {

  constructor(octokit) {
    if (!octokit) {
      throw new Error('An octokit client must be provided');
    }
    this._octokit = octokit;
  }

  getRepositories(org) {
    return this.octokit.paginate("GET /orgs/:org/repos", {org: org, per_page: 100})
      .then(repos => {
        console.log(repos);
        console.log(`Processing ${repos.length} repositories`);
        return repos.map(repo => { return {
          name: repo.name,
          owner: org, //TODO verify this in not in the payload
          full_name: repo.full_name,
          has_issues: repo.has_issues,
          has_projects: repo.has_projects,
          url: repo.html_url,
        }});
      })
      .catch(error => {
        console.log(`Invalid organization name ==> ${org} ${error.message}`);
        return {status:'error',message: error.message};
      });
  }

  findUsers(org) {
    return this.octokit.paginate("GET /orgs/:org/members", {org: org, per_page: 100})
      .then(members => {
        return members.map(member => {
          return {
            login: member.login,
            email: member.email || '',
            orgs: org
          };
        });
      });
  }

  get octokit() {
    return this._octokit;
  }
}