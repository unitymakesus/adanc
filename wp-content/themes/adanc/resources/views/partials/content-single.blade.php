<article class="container content-wrapper" @php post_class() @endphp>
  <header>
    <h1 class="entry-title">{{ get_the_title() }}</h1>
    <!-- @include('partials/entry-meta') -->
  </header>
  <div class="entry-content">
    @php the_content() @endphp
  </div>
  @php comments_template('/partials/comments.blade.php') @endphp
</article>
