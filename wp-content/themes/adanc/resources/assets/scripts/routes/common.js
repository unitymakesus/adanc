export default {
  init() {
    /**
     * Set aria labels for current navigation items
     */
    // Main navigation in header and footer
    $('.menu-primary-menu-container .menu-item').each(function() {
      if ($(this).hasClass('current-page-ancestor')) {
        $(this).children('a').attr('aria-current', 'true');
      }
      if ($(this).hasClass('current-menu-item')) {
        $(this).children('a').attr('aria-current', 'page');
      }
    });
  },
  finalize() {
    const mDown = window.matchMedia( "(max-width: 992px)" );

    // Activate search box
    function activateSearch() {
      $('.a11y-tools .search-form').addClass('active');
      $('.a11y-tools .search-form .search-submit').removeClass('disabled');
    }

    // Deactivate search box
    function deactivateSearch() {
      $('.a11y-tools .search-form').removeClass('active');
      $('.a11y-tools .search-form .search-submit').addClass('disabled');
    }

    // Show a11y toolbar
    function showA11yToolbar() {
      $('body').addClass('a11y-tools-active');
      $('#a11y-tools-trigger + label i').attr('aria-label', 'Hide accessibility tools');

      // Enable focus of tools using tabindex
      $('.a11y-tools').each(function() {
        var el = $(this);
        $('input', el).attr('tabindex', '0');
      });
    }

    // Hide a11y toolbar
    function hideA11yToolbar() {
      $('body').removeClass('a11y-tools-active');
      $('#a11y-tools-trigger + label i').attr('aria-label', 'Show accessibility tools');

      // Disable focus of tools using tabindex
      $('.a11y-tools').each(function() {
        var el = $(this);
        $('input', el).attr('tabindex', '-1');
      });
    }

    // Show mobile nav
    function showMobileNav() {
      $('body').addClass('mobilenav-active');
      $('#menu-trigger + label i').attr('aria-label', 'Hide navigation menu');

      // Enable focus of nav items using tabindex
      $('.navbar-menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '0');
      });
    }

    // Hide mobile nav
    function hideMobileNav() {
      $('body').removeClass('mobilenav-active');
      $('#menu-trigger + label i').attr('aria-label', 'Show navigation menu');

      // Disable focus of nav items using tabindex
      $('.navbar-menu').each(function() {
        var el = $(this);
        $('a', el).attr('tabindex', '-1');
      });
    }

    // Toggle mobile nav
    $('#menu-trigger').on('change focusout', function() {
      if ($(this).prop('checked')) {
        showMobileNav();
      } else {
        hideMobileNav();
      }
    });

    // Only show mobile nav if an element inside is receiving focus
    $('.navbar-menu').each(function () {
      var el = $(this);

      $('a', el).on('focus', function() {
        $(this).parents('li').addClass('hover');
      }).on('focusout', function() {
        $(this).parents('li').removeClass('hover');

        if (mDown.matches) {
          setTimeout(function () {
            if ($(':focus').closest('#menu-primary-menu').length == 0) {
              $('#menu-trigger').prop('checked', false);
              hideMobileNav();
            }
          }, 200);
        }
      });
    });

    // Only show search if element inside is receiving focus
    $('.a11y-tools .search-form').on('click', 'input', function(e) {
      e.preventDefault();

      // Only allow default action (submit) if the search field has content
      // If not, switch focus to search field instead
      if ($(this).hasClass('search-submit')) {
        if ($('.a11y-tools .search-field').val().length > 0) {
          $('.a11y-tools .search-form').submit();
        } else {
          $('.a11y-tools .search-form .search-field').focus();
        }
      }

      return false;
    }).on('focus', 'input', function() {
      activateSearch();
    }).on('focusout', function() {
      setTimeout(function () {
        if ($(':focus').closest('.a11y-tools').length == 0) {
          deactivateSearch();
        }
      }, 200);
    });

    // Toggle a11y toolbar
    $('#a11y-tools-trigger').on('change', function() {
      if ($(this).prop('checked')) {
        showA11yToolbar();
      } else {
        hideA11yToolbar();
      }
    });

    // Make a11y toolbar keyboard accessible
    $('.a11y-tools').on('focusout', 'input', function() {
      setTimeout(function () {
        if (mDown.matches) {
          if ($(':focus').closest('.a11y-tools').length == 0) {
            $('#a11y-tools-trigger').prop('checked', false);
            hideA11yToolbar();
          }
        }
      }, 200);
    });

    // Controls for changing text size
    $('#text-size input[name="text-size"]').on('change', function() {
      let tsize = $(this).val();
      $('html').attr('data-text-size', tsize);
      document.cookie = 'data_text_size=' + tsize + ';max-age=31536000;path=/';
    });

    // Controls for changing contrast
    $('#toggle-contrast input[name="contrast"]').on('change', function() {
      let contrast = $(this).is(':checked');
      $('html').attr('data-contrast', contrast);
      if (contrast) {
        document.cookie = 'data_contrast=' + contrast + ';max-age=31536000;path=/';
      } else {
        document.cookie = 'data_contrast=;max-age=-999999999;path=/';
      }
    });

    // Helper function for translation cookies
    function getDomainName(hostName) {
      return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    }

    // Set up translation on click
    $(document).on('click','.gtranslate', function(e) {
      e.preventDefault();
      var hostname = window.location.hostname;
      var domain = getDomainName(hostname);

      if ($(this).is(':checked')) {
        document.cookie = "googtrans=/en/es;path=/;domain=" + domain + ";";

        $('#toggle-espanol legend').text('View in English:').addClass('notranslate');
        $('#toggle-espanol label').text('English').addClass('english');
      } else {
        document.cookie = "googtrans=;max-age=-999999999;path=/;domain=" + domain + ";";
        document.cookie = "googtrans=;max-age=-999999999;path=/;";

        $('#toggle-espanol legend').text('Ver En Español:').removeClass('notranslate');
        $('#toggle-espanol label').text('En Español').removeClass('english');
      }

      location.reload();
    });
  },
};
