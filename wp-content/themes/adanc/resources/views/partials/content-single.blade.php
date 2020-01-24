<article class="container content-wrapper" @php post_class() @endphp>
  <header>
    <h1 class="entry-title">{{ get_the_title() }}</h1>
    <!-- @include('partials/entry-meta') -->
    {!! the_post_thumbnail('large', [
      'class' => 'post-image'
    ]) !!}
  </header>

  <div class="entry-content">
    @php the_content() @endphp
  </div>
</article>
