"use strict";
const  API_URL=`https://api.github.com/users/`;
const form=document.querySelector('#form');
const searchBar=document.querySelector('#search-bar');
const userDispContainer=document.querySelector('.user-card');
async function fetchUserData(userName){
    const resp= await fetch(API_URL+userName);
    const respData= await resp.json();
    return respData;
}

async function fetchUserRepos(userName){
    const resp= await fetch(API_URL+userName+'/repos');
    const respData= await resp.json();
    return respData; 
}

function loadUserRepos(userRepos){
    const repoUl=document.createElement('ul');
    // ====== Sorting Respos by Stars =======
   userRepos.sort((a,b) =>a.stargazers_count - b.stargazers_count )
   .slice(0,10)
   .forEach(repoData => {
    const {html_url,name}=repoData;
    const repo=document.createElement('li');
    const repoLink=document.createElement('a');
    repoLink.textContent=name;
    repoLink.href=html_url;
    repoLink.target='_blank';
    repo.appendChild(repoLink);
    repoUl.appendChild(repo);    
    });
   return repoUl.innerHTML;
}


async function loadUserProfile(userName){
  // ----------- Fetching user Data -------------
  const userData=await fetchUserData(userName);
  if(userData.message==='Not Found')  {
    userDispContainer.innerHTML='No User Found'
    return;
};
  const {avatar_url,html_url,login,bio,following,followers,public_repos}=userData;
  const userRepos= await fetchUserRepos(login);
   // ----------- Fetching user Repos Html Li -------------
  const reposHtml= loadUserRepos(userRepos);
  const html=`
    <img src="${avatar_url}" alt="${userData.login}">
<div class="user-info">
    <h2><a href=${html_url} target="_blank">${login}</a></h2>
    <p>${!bio?'No Bio': bio}</p>
    <ul>
    <li><strong>${following}</strong> <span> Following</span></li>
    <li><strong>${followers}</strong>  <span> Followers</span></li>
    <li><strong>${public_repos}</strong>  <span> Repos</span></li>    
    </ul>    
    </div>
    <div class="user-repos">
    <h3>Repos:</h3>
    <ul class="repos-list">
    ${reposHtml}
    </ul>
    </div>
    </div>
  `;
  userDispContainer.innerHTML=html;
  userDispContainer.style.opacity='1';
}

form.addEventListener('submit',e=>{
    e.preventDefault();
    const searchTerm=searchBar.value;
    if(!searchTerm) return;
   loadUserProfile(searchTerm);
   searchBar.value='';
})

// loadUserProfile('omerawan445')