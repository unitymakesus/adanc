@php
$services = new WP_Query([
  'post_type' => 'services',
  'posts_per_page' => -1,
  'orderby' => 'menu_order',
  'order' => 'ASC',
]);
@endphp
<div class="container">
  @if ($services->have_posts()) @while ($services->have_posts()) @php $services->the_post() @endphp
    <div class="row service">
      <div class="col m3">
        {!! get_the_post_thumbnail(get_the_ID(), 'medium') !!}
      </div>
      <div class="col m9">
        <h2>{!! get_the_title() !!}</h2>
        @php the_content() @endphp
      </div>
    </div>
  @endwhile @endif @php wp_reset_postdata(); @endphp
</div>
