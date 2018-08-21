<?php

namespace App;

/**
 * Detect custom WP_Query for filtering
 */
add_filter( 'facetwp_is_main_query', function( $is_main_query, $query ) {
  if ( '' !== $query->get( 'facetwp' ) ) {
    $is_main_query = (bool) $query->get( 'facetwp' );
  }
  return $is_main_query;
}, 10, 2 );

/**
 * Create facets from ACF Relationship Fields
 */
add_filter( 'facetwp_index_row', function( $params, $class ) {
    if ( 'resource_issue' == $params['facet_name'] || 'resource_initiative' == $params['facet_name'] ) {
        $values = (array) $params['facet_value']; // an array of post IDs (it's already unserialized)
        foreach ( $values as $val ) {
            $params['facet_value'] = $val;
            $params['facet_display_value'] = get_the_title( $val );
            $class->insert( $params ); // insert each value to the database
        }
        // skip the default indexing query
        return false;
    }
    return $params;
}, 10, 2 );

/**
 * Order year facets in descending order
 */
add_filter( 'facetwp_facet_orderby', function( $orderby, $facet ) {
    if ( 'resource_year' == $facet['name'] ) {
        $orderby = 'f.facet_display_value+0 DESC';
    }
    return $orderby;
}, 10, 2 );

/**
 * Add label before per-page selector
 */
add_filter( 'facetwp_per_page_html', function( $output ) {
  $find = [
    '<select class="facetwp-per-page-select">',
    '<option value="">Per page</option>'
  ];
  $replace = [
    '<select class="facetwp-per-page-select" id="facetwp-per-page-select">',
    ''
  ];
  $output = str_replace($find, $replace, $output);
  return '<label for="facetwp-per-page-select">Results per page</label> ' . $output;
}, 10, 1 );

/**
 * Add label before sort selector
 */
add_filter( 'facetwp_sort_html', function( $output ) {
  $find = [
    '<select class="facetwp-sort-select">',
    '<option value="default">Sort by</option>'
  ];
  $replace = [
    '<select class="facetwp-sort-select" id="facetwp-sort-select">',
    '<option value="default">Default</option>'
  ];
  $output = str_replace($find, $replace, $output);
  return '<label for="facetwp-sort-select">Sort by</label> ' . $output;
}, 10, 1 );

/**
 * Remove 'posts' from post type facet on search page
 */
 add_filter( 'facetwp_index_row', function( $params, $class ) {
  if ( 'filter_content_type' == $params['facet_name'] ) {
    $excluded_terms = array( 'Posts', 'post' );
    if ( in_array( $params['facet_display_value'], $excluded_terms ) ) {
      return false;
    }
  }
  return $params;
}, 10, 2 );

/**
 * Change output of results count
 */
add_filter( 'facetwp_result_count', function( $output, $params ) {
    $output = 'Displaying Results ' . $params['lower'] . '-' . $params['upper'] . ' of ' . $params['total'];
    return $output;
}, 10, 2 );

/**
 * Make pagination accessible
 */
add_filter( 'facetwp_pager_html', function( $output, $params ) {
  $output = '';
  $page = (int) $params['page'];
  $per_page = (int) $params['per_page'];
  $total_rows = (int) $params['total_rows'];
  $total_pages = (int) $params['total_pages'];

  if ( 1 < $total_pages ) {
    $text_page      = __( 'Page', 'fwp' );
    $text_of        = __( 'of', 'fwp' );
    $output = '<label>' . "$text_page $page $text_of $total_pages</label>";
    $output .= '<ul>';
    $gap_before = '';
    $gap_after = '';

    if ( 3 < $page ) {
        $gap_after = ' class="gap after"';
        $output .= '<li' . $gap_after . '><a class="facetwp-page first-page" data-page="1" aria-label="Go To First Page">&lt;&lt;</a></li>';
    }
    if ( 1 < ( $page - 10 ) ) {
        $gap_after = ' class="gap after"';
        $output .= '<li' . $gap_after . '><a class="facetwp-page" data-page="' . ($page - 10) . '" aria-label="Go To Page ' . ($page - 10) . '">' . ($page - 10) . '</a></li>';
    }
    for ( $i = 2; $i > 0; $i-- ) {
        if ( 0 < ( $page - $i ) ) {
            $output .= '<li><a class="facetwp-page" data-page="' . ($page - $i) . '" aria-label="Go To Page ' . ($page - $i) . '">' . ($page - $i) . '</a></li>';
        }
    }

    // Current page
    $output .= '<li><a class="facetwp-page active" data-page="' . $page . '" aria-label="Go To Page ' . $page . '">' . $page . '</a></li>';

    for ( $i = 1; $i <= 2; $i++ ) {
        if ( $total_pages >= ( $page + $i ) ) {
            $output .= '<li><a class="facetwp-page" data-page="' . ($page + $i) . '" aria-label="Go To Page ' . ($page + $i) . '">' . ($page + $i) . '</a></li>';
        }
    }
    if ( $total_pages > ( $page + 9 ) ) {
        $gap_before = ' class="gap before"';
        $output .= '<li' . $gap_before . '><a class="facetwp-page" data-page="' . ($page + 9) . '" aria-label="Go To Page ' . ($page + 9) . '">' . ($page + 9) . '</a></li>';
    }
    if ( $total_pages > ( $page + 19 ) ) {
        $gap_before = ' class="gap before"';
        $output .= '<li' . $gap_before . '><a class="facetwp-page" data-page="' . ($page + 19) . '" aria-label="Go To Page ' . ($page + 19) . '">' . ($page + 19) . '</a></li>';
    }
    if ( $total_pages > ( $page + 2 ) ) {
        $output .= '<li class="gap before"><a class="facetwp-page last-page" data-page="' . $total_pages . '" aria-label="Go To Last Page">&gt;&gt;</a></li>';
    }

    $output .= '</ul>';
  }

  return $output;

}, 10, 2 );
