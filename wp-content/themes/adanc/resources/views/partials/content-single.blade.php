<article class="container content-wrapper" @php post_class() @endphp>
  <header>
    <h1 class="entry-title">{{ get_the_title() }}</h1>
    <!-- @include('partials/entry-meta') -->
    <img class="post-image" src="{!! get_the_post_thumbnail_url($id, 'large') !!}"/>
  </header>
  
  <div class="entry-content">
    @php the_content() @endphp
  </div>
</article>
