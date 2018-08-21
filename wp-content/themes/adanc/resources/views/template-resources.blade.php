{{--
  Template Name: Resources Page
--}}

@extends('layouts.app')

@section('content')
@while(have_posts()) @php the_post() @endphp
  @include('partials.page-header')
  @include('partials.content-page')
@endwhile

<section class="border-top" role="region" aria-label="Resources List">
  <div class="container">
    <div class="row flex">
      <div class="col m6 s12">
        {!! do_shortcode('[facetwp sort="true"]') !!}
      </div>
      <div class="col m6 s12 right-align flex flex-bottom">
        {!! do_shortcode('[facetwp counts="true"]') !!}
      </div>
    </div>

    <div class="row">
      <div class="col m3 s12">
        {!! do_shortcode ('[facetwp facet="search"]') !!}
        {!! do_shortcode('[facetwp facet="resource_topic"]') !!}
        {!! do_shortcode('[facetwp facet="resource_type"]') !!}
        {!! do_shortcode('[facetwp facet="resource_source"]') !!}
      </div>

      <div class="col m9 s12">
        <div class="facetwp-template">
          <?php
            $resources = new WP_Query([
              'post_type' => 'ada-resource',
              'posts_per_page' => 10,
              'facetwp' => true,
              'orderby' => 'menu_order',
              'order' => 'ASC'
            ]);
          ?>

          @if ($resources->have_posts())

            @while ($resources->have_posts())
              @php $resources->the_post() @endphp
              @include('partials.content-single-resource')
            @endwhile

            <nav class="pagination" role="navigation" aria-label="Results Pagination">
              {!! do_shortcode('[facetwp pager="true"]') !!}
            </nav>
          @else
            <p><?php _e( 'Sorry, no resources matched your criteria.' ); ?></p>
          @endif
          @php wp_reset_postdata() @endphp
        </div>
      </div>
    </div>
  </div>
</section>
@endsection
