<script setup>
definePageMeta({ middleware: "session" });
const { user } = useUserSession();
</script>

<template>
  <form>
    <div class="row g-2">
      <div class="col-lg-6">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <div class="form-floating mb-2">
            <input type="text" class="form-control" placeholder="Username" :value="user.ghUser" readonly>
            <label>Username</label>
          </div>
          <div class="form-floating mb-2">
            <input type="text" class="form-control" placeholder="Name" :value="user.name" required>
            <label>Name</label>
          </div>
          <div class="form-floating mb-2">
            <textarea class="form-control" placeholder="Bio" :value="user.bio" :style="{ height: '100px' }" required />
            <label>Bio</label>
          </div>
          <div class="form-floating">
            <select class="form-select" aria-label="Country">
              <option selected disabled>Select country</option>
            </select>
            <label>Country</label>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="bg-body-tertiary rounded-3 p-3 p-lg-4">
          <div class="d-flex gap-2 align-items-center mb-2">
            <Icon name="bi:github" size="1.5em" />
            <div class="form-floating flex-fill">
              <input type="text" class="form-control" placeholder="Github" :value="`https://github.com/${user.ghUser}`" required>
              <label>Github</label>
            </div>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <Icon name="solar:earth-bold" size="1.5em" />
            <div class="form-floating flex-fill">
              <input type="text" class="form-control" placeholder="Webside" :value="user.twitterUser" required>
              <label>Website</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
