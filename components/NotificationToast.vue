<template>
  <div class="toast-container position-fixed bottom-0 start-0 p-3">
    <div id="notification" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <img :src="`https://avatars.githubusercontent.com/u/${user.ghId}?v=4`" height="20" width="20" class="rounded-circle me-2">
        <strong class="me-auto text-dark-emphasis">{{ user.ghUser }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" />
      </div>
      <div class="toast-body">
        <div class="d-flex align-items-center gap-2">
          <Icon v-if="success" name="solar:check-circle-bold" size="1.5em" class="text-success-emphasis" />
          <Icon v-else name="solar:close-circle-bold" size="1.5em" class="text-danger-emphasis" />
          {{ text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    text: {
      type: String,
      default: ""
    },
    success: {
      type: Boolean,
      default: false
    }
  }
};
</script>
