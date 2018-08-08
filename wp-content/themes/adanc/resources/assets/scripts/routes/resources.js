export default {
  finalize() {
    $(document).on('facetwp-loaded', function() {
      /**
       * Add labels above each facet
       */
      $('.facetwp-facet').each(function() {
        let facet_name = $(this).attr('data-name');
        // eslint-disable-next-line no-undef
        let facet_label = FWP.settings.labels[facet_name];
        if ($('.facet-label[data-for="' + facet_name + '"]').length < 1) {
          $(this).before('<div class="h4 facet-label" data-for="' + facet_name + '">' + facet_label + '</div>');
        }
        // Add aria support for search field
        if (facet_name == 'search') {
          $(this).find('input').attr('aria-label', facet_label);
        }
      });

      /**
       * Add aria support for checkboxes
       */
       $('.facetwp-checkbox').each(function() {
         $(this).attr('role', 'checkbox');
         $(this).attr('aria-checked', $(this).hasClass('checked') ? 'true' : 'false');
         $(this).attr('tabindex', 0);

         $(this).bind( 'keydown', function( e ) {
           if( e.keyCode == 32 || e.keyCode == 13 ) {
             e.stopPropagation();
             e.preventDefault();
             // eslint-disable-next-line no-undef
             LG.LAST_FACETWP_CHECKED = $(this).data( 'value' );
             $(this).click();
           }
         } );
       });
    });
  },
};
