<template>
  <div id="app" class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary" md-elevation="1">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <h1 class="md-title">{{pageTitle}}</h1>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" md-persistent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <md-button class="md-icon-button" @click="toggleMenu">
            <md-icon>keyboard_arrow_left</md-icon>
          </md-button>
          <a href="/#/" class="logo"><img src="img/solar scorecard logo v4.svg" alt="solar scorecard logo"></a>
        </md-toolbar>

        <md-list>
          <md-list-item to="/">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">The Solar Scorecard</span>
          </md-list-item>

          <md-list-item to="/map">
            <md-icon>map</md-icon>
            <span class="md-list-item-text">Map</span>
          </md-list-item>

          <md-list-item to="/why-solar">
            <md-icon>wb_sunny</md-icon>
            <span class="md-list-item-text">Why Solar?</span>
          </md-list-item>

          <md-list-item to="/methodology">
            <md-icon>directions</md-icon>
            <span class="md-list-item-text">Methodology</span>
          </md-list-item>

          <md-list-item to="/going-solar">
            <md-icon>arrow_forward</md-icon>
            <span class="md-list-item-text">Going Solar</span>
          </md-list-item>

          <md-list-item to="/about">
            <md-icon>info</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <!-- component matched by the route will render here -->
        <router-view @on-page-title-change="updatePageTitle"></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      menuVisible: true,
      pageTitle: 'This is the original title',
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    updatePageTitle(title){
      this.pageTitle = title;
    },
  },
};
</script>

<style lang="scss">
@import 'scss/main.scss';
</style>
