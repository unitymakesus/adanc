<article class="container content-wrapper" @php post_class() @endphp>
  <header>
    <h1 class="entry-title">{{ get_the_title() }}</h1>
    <!-- @include('partials/entry-meta') -->
    <img class="post-image" src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
  </header>
  <div class="entry-content">
    @php the_content() @endphp

    <div class="nextposts">
      @php previous_post_link( '%link', '<= Previous Post ', TRUE ) @endphp
      @php next_post_link( '%link', 'Next Post =>', TRUE ) @endphp
    </div>
  </div>
</article>
