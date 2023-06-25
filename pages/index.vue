<script setup>
const { data: start } = await useFetch("/api/start");
</script>

<template>
  <main>
    <div class="row g-2">
      <div class="col-lg-8">
        <div class="row g-2">
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>About</h2>
              <p class="m-0">Fetch and display all npm packages used among all your GitHub projects. Login with your GitHub account, update your package list, and explore the lists of other registered users.</p>
            </div>
          </div>
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>Get started</h2>
              <p>To create your list you must follow the following steps:</p>
              <ol>
                <li>Click on the <strong>Log in with GitHub</strong> button.</li>
                <li>Authorize the application to access your GitHub account.</li>
                <li>After authorizing for the first time, your profile will be created.</li>
                <li>Click on your username in the top right corner to open a dropdown menu.</li>
                <li>Click on <strong>Profile</strong> to go to your profile page.</li>
                <li>Click on the <strong>Update List</strong> button to fetch your packages.</li>
              </ol>
            </div>
          </div>
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>How it works</h2>
              <p>The app interacts with the GitHub API and retrieves information about a user's repositories and their package dependencies. Currently limited to the 100 most recently updated repositories.</p>
              <p>To retrieve and make a list of your packages, it is considered the following:</p>
              <ol>
                <li>The user's repositories, specifically the ones that the user owns, have public visibility and is not a fork.</li>
                <li>Fetch the <code>package.json</code> file for each repository. It looks for the file located in the repository's root directory.</li>
                <li>If the <code>package.json</code> file exists, the content is parsed to extract the <code>dependencies</code> and <code>devDependencies</code> objects and merge them into a single object.</li>
                <li>For each dependency found in the merged object, it counts and store the number of times it is used among all the user's repositories and the different versions found.</li>
              </ol>
            </div>
          </div>
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>Contribute</h2>
              <p>The source code for this project is available on GitHub. Feel free to contribute to the project by opening an issue or submitting a pull request.</p>
              <div class="d-flex gap-2 align-items-center">
                <Icon name="bi:github" size="1.3em" />
                <a href="https://github.com/Yizack/my-npm-list/" target="_blank">Yizack/my-npm-list</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ms-auto col-lg-4">
        <div class="row g-2">
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>Recently joined users</h2>
              <div class="d-flex flex-column gap-2">
                <div v-for="user of start.users" :key="user.ghId">
                  <div class="d-flex gap-2 align-items-center">
                    <NuxtLink :to="`/user/${user.ghUser}`" class="d-flex align-items-center">
                      <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4&s=24`" alt="avatar" class="rounded-circle me-2" width="24" height="24">
                      <span class="text-break"><strong>{{ user.ghUser }}</strong></span>
                    </NuxtLink>
                    <Icon class="flex-shrink-0 text-primary-emphasis" name="solar:clock-circle-linear" />
                    <span class="flex-fill flex-shrink-0 text-muted">{{ getTimeAgo(user.joined) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
              <h2>Popular packages</h2>
              <p>Top 5 packages by number of users</p>
              <div v-for="pkg of start.packages_users" :key="pkg.name">
                <div class="d-flex gap-2 align-items-center">
                  <Icon class="flex-shrink-0" name="solar:box-bold" size="1.3em" />
                  <NuxtLink :to="`/package/${pkg.name}`" class="d-flex align-items-center">
                    <span class="text-break"><strong>{{ pkg.name }}</strong></span>
                  </NuxtLink>
                  <span class="flex-shrink-0 text-muted">{{ pkg.count }} {{ pkg.count > 1 ? 'users' : 'user' }}</span>
                </div>
              </div>
              <hr>
              <p>Top 5 packages by times used</p>
              <div v-for="pkg of start.packages_used" :key="pkg.name">
                <div class="d-flex gap-2 align-items-center">
                  <Icon class="flex-shrink-0" name="solar:box-bold" size="1.3em" />
                  <NuxtLink :to="`/package/${pkg.name}`" class="d-flex align-items-center">
                    <span class="text-break"><strong>{{ pkg.name }}</strong></span>
                  </NuxtLink>
                  <span class="flex-shrink-0 text-muted">used {{ pkg.count }} {{ pkg.count > 1 ? 'times' : 'time' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
