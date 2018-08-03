<article class="col s12 m6 l4" @php post_class() @endphp>
  <header>
    <div class="image-container">
    @if(has_post_thumbnail())
      <img src="{!! get_the_post_thumbnail_url($id, 'medium') !!}"/>
    @endif
    </div>
    <h3 class="entry-title"><a href="{{ get_permalink() }}">{{ get_the_title() }}</a></h3>
    <!-- @include('partials/entry-meta') -->
  </header>
  <div class="entry-summary">
    <p>@php the_excerpt() @endphp</p>
  </div>
</article>
