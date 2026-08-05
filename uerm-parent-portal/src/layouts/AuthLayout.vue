<template>
  <q-layout view="lHh Lpr fff" class="main-background">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.main-background {
  min-height: 100vh;
  background-color: #0d47a1;
  background-image: linear-gradient(
      to top,
      rgba(20, 74, 173, 0.8),
      rgba(255, 214, 0, 0.6)
    ),
    url("src/assets/uerm-bg.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
}

.logo-avatar {
  size: 70px;
  margin-right: 8px;
}

.title-underline {
  width: 500px;
  height: 8px;
  background-color: #ffd600;
}

@media (max-width: 599px) {
  .header-toolbar {
    flex-wrap: wrap;
  }

  .logo-avatar {
    size: 200px;
    margin-right: 8px;
  }

  .portal-title {
    font-size: 15px;
    letter-spacing: 1px !important;
    text-align: center;
  }

  .title-underline {
    width: 70%;
    max-width: 220px;
    height: 5px;
  }

  .page-subtitle {
    font-size: 12px;
  }
}
</style>
