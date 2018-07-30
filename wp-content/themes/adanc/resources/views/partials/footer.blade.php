<footer class="content-info">
  <div class="row">
    <div class="col s6 m4">
      @php dynamic_sidebar('sidebar-footer') @endphp
    </div>
    <div class="col s6 m4">
      @php dynamic_sidebar('sidebar-footer-2') @endphp
    </div>

    <div class="col s12 m4">
      @php dynamic_sidebar('sidebar-footer-3') @endphp
    </div>
  </div>
</footer>

<div class="footer-copyright">
  <div class="row">
    <div class="col m4">
      <span class="copyright">&copy; ADA @php(current_time('Y')) All Rights Reserved</span>
    </div>
    <div class="col m4">
      <a class="privacy" href="<?php get_site_url()?>/privacy-policy/"> Privacy Policy</a>
    </div>

    <div class="col m4">
      @include('partials.unity')
    </div>
  </div>
</div>
