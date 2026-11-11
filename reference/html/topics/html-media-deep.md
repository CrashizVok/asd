# HTML media

HTML topic · Exam Wiki

Three elements cover almost every media need on an exam page: `video` for moving pictures, `audio` for sound, and `iframe` for a document hosted somewhere else. All three play without JavaScript, all three have keyboard support built in, and all three can be made inaccessible in one missing attribute.

The pattern is the same each time: pick the element, give the browser a list of files it might be able to play, give the user controls, and give anyone who cannot see or hear the media a text path to the same information.

## Simplest form

```html
<!-- Data shape: one media file, native controls, no script -->
<video src="room-tour.mp4" controls width="640" height="360"></video>
```

One element, one file, controls. That is valid and it works in every current browser. The rest of this page is about what to add when the file has dialogue, when one format is not enough, and when the media is a whole page from another site.

## video

`video` embeds a video player. The element has no visible content of its own, so it needs either a `src` attribute or one or more `source` children.

Attributes that change behaviour:

- `controls` shows the browser's play, pause, volume, time and fullscreen controls. Without it the video is a still frame with no way to start.
- `width` and `height` reserve space before the file loads. They are numbers in CSS pixels, not units. Without them the page jumps when the video arrives.
- `poster` is the image shown before playback. It is a placeholder, not a description, so it gets no `alt`.
- `preload="none"` tells the browser not to fetch the file until the user presses play. `"metadata"` fetches duration and size only. `"auto"` lets it fetch the whole file. Do not preload several large videos at once.
- `muted` starts with the sound off. It is the only way `autoplay` works in Chrome and Safari.
- `autoplay` starts playback as soon as the browser can. Without `muted` it is usually blocked.
- `loop` restarts at the end.
- `playsinline` stops iOS from taking the video fullscreen on its own. Needed for background video and for small inline clips.
- `crossorigin` is required when the video or its caption files come from another origin. Use `crossorigin="anonymous"` and make sure the other server sends the CORS header.

Content between the opening and closing tag is fallback. Browsers that support `video` ignore it. Browsers that do not, including text browsers and some feed readers, show it. Put a download link there:

```html
<video controls width="640" height="360" poster="room-poster.jpg">
  <source src="room-tour.mp4" type="video/mp4">
  <p>Your browser cannot play this video.
     <a href="room-tour.mp4">Download the room tour</a> (8 MB).</p>
</video>
```

That paragraph is also what a screen reader reads if the video element itself is not supported, and what search engines index. It costs one line and covers the worst case.

## audio

`audio` works the same way with fewer attributes. It has no visual area, so `width`, `height` and `poster` do not exist. It still accepts `controls`, `src`, `preload`, `autoplay`, `loop`, `muted` and `crossorigin`.

An audio player with no visible fallback is a trap on slow connections: the user sees a small control strip with no indication of what it contains. Put the title in a `figure` caption or a heading, and put a download link in the fallback.

`audio` is not a good place for music that starts by itself. Use `controls` and let the user decide.

## source

`source` gives the browser a choice. It is an empty element, so it has no closing tag. The browser walks the list in order and plays the first file it can handle.

- `src` is the file.
- `type` is the MIME type, optionally with codecs: `type="video/mp4; codecs=avc1.42E01E, mp4a.40.2"`. With `type` the browser can skip a file it cannot play without downloading it. Without `type` it may download the whole file to find out.
- `media` is for `picture`, not for `video` or `audio`. A media query on a `source` inside `video` is ignored.

Order and format:

- MP4 with H.264 video and AAC audio plays almost everywhere. WebM with VP9 and Opus is smaller but not universal. Put the format you trust first for compatibility, or the smaller one first if size matters more than the last few percent of browsers.
- Common audio formats: MP3 (universal), AAC in M4A (Apple and most browsers), Ogg Opus (small, broad support outside older Safari), WAV (lossless, large, avoid for web delivery).
- A `source` list is not a fallback chain in the sense of "try again on error". If the first file is chosen and then fails to load, the browser does not automatically move to the second. Test the files.

```html
<video controls width="640" height="360" poster="room-poster.jpg">
  <source src="room-tour.webm" type="video/webm">
  <source src="room-tour.mp4" type="video/mp4">
  <p><a href="room-tour.mp4">Download the room tour</a></p>
</video>
```

## track

`track` adds timed text to `video` or `audio`. It is an empty element and it points at a WebVTT file.

- `kind="subtitles"` translates dialogue for viewers who can hear it but do not understand the language. It assumes the soundtrack is available.
- `kind="captions"` is for viewers who cannot hear the audio. It includes dialogue and important sounds such as "[door closes]" or "[applause]". This is the kind most exam pages need.
- `kind="descriptions"` provides text descriptions of the visual content for screen reader users. It is a text track, not recorded audio.
- `kind="chapters"` turns the track into a chapter menu. Titles come from the cue text, and cue start times become the chapter starts.
- `kind="metadata"` is data for scripts and is not shown to the user.
- `srclang` is the language of the track, for example `en`. It is required for `subtitles`.
- `label` is the text shown in the captions menu, for example `English` or `Magyar`.
- `default` makes this track active when the page loads. Set it on one track per kind, or captions stay off until the user finds the menu.

A WebVTT file starts with the line `WEBVTT`, then a blank line, then cues. Each cue has a timing line such as `00:00:01.000 --> 00:00:04.000` and one or more text lines, ended by a blank line. Optional settings after the timing control position: `align:start`, `line:90%`, `position:20%`. A cue identifier can sit above the timing line. Comments start with `NOTE`.

The server must send the file as `text/vtt`. A `.vtt` served as `text/plain` is rejected by some browsers, and the captions silently never appear. If the media and the track are on different origins, the media element needs `crossorigin="anonymous"` and the track server needs the CORS header. This is the most common reason captions work locally and fail in production.

```html
<video controls width="640" height="360" poster="room-poster.jpg">
  <source src="room-tour.mp4" type="video/mp4">
  <track kind="captions" src="room-tour.en.vtt" srclang="en" label="English" default>
  <track kind="captions" src="room-tour.hu.vtt" srclang="hu" label="Magyar">
</video>
```

Captions are not a substitute for a transcript when the media carries information that matters. A transcript is text on the page, indexable and readable without playing anything. Put it in a `details` element below the player when it is long.

## iframe

`iframe` embeds another HTML document inside the current page. It is a separate browsing context: its own document, its own styles, its own scripts, its own keyboard focus order. The browser draws a frame and the embedded page lives inside it.

Attributes:

- `src` is the document to load. It can be relative or absolute, but not `about:blank` for real content.
- `title` is required in practice. A screen reader announces the frame by its title before reading inside it. "Frame" or "Embedded content" is a wasted announcement. Write what the frame contains: `title="Map showing the hotel on Dock Street"`.
- `width` and `height` reserve space. Set them in CSS for responsiveness, and keep the attribute values as a fallback for layout shift.
- `loading="lazy"` delays loading until the frame is near the viewport. Use it for maps and players below the fold, not for a frame at the top of the page.
- `sandbox` restricts what the embedded document may do. An empty `sandbox=""` blocks scripts, forms, popups, and same-origin access. Add only the tokens the frame needs.
- `allow` passes permission policy features such as `fullscreen`, `autoplay` or `camera`.
- `allowfullscreen` is the older boolean form for fullscreen video frames.
- `referrerpolicy="no-referrer"` stops the frame from receiving the page URL as a referrer.
- `srcdoc` puts a small HTML document directly in the attribute, which is handy for demos and useless for anything large.

Sandbox tokens and what they open:

- `allow-scripts` lets the frame run JavaScript.
- `allow-same-origin` lets the frame keep its origin, which gives it access to cookies and storage for that origin. Combined with `allow-scripts` on a same-origin frame, the frame can remove the sandbox attribute from its own document, so the combination is close to no sandbox at all. Never use both for content you do not control.
- `allow-forms` allows form submission.
- `allow-popups` allows `window.open` and target blank links.
- `allow-downloads` allows downloads.
- `allow-presentation` allows the Presentation API.
- `allow-top-navigation-by-user-activation` allows a user initiated navigation of the whole tab.

Security notes that belong with the tag:

- Embedding another site means that site can see the request, set cookies in its own origin, and track the user. Treat it as third party code.
- Your own pages should refuse framing when they contain actions, or an attacker can overlay them and steal clicks. That is set by a response header, `Content-Security-Policy: frame-ancestors 'none'`, or the older `X-Frame-Options: DENY`. It is not an HTML attribute.
- A frame that loads over `http` inside an `https` page is blocked as mixed content.
- Frames are a separate document, so the page's `lang`, headings and landmarks do not reach inside. The embedded page must provide its own.

Accessibility notes:

- The `title` is the only name the frame gets. Make it unique when there are several.
- Do not put the whole page, the main navigation, or the primary content in a frame. Keyboard users get trapped in a second document and the browser back button behaves unexpectedly.
- Maps, video players, payment forms, and document previews are the legitimate cases.
- A frame inside a `noscript` or behind a consent wall needs a text alternative and a link to open the content directly.
- Responsive frames use a wrapper with `aspect-ratio` and a frame sized `width: 100%; height: 100%`.

`object` and `embed` are the older general purpose embed elements. `object` can hold PDFs, SVG and fallback content; `embed` is a void element with almost no fallback. For video and audio, use `video` and `audio`. For another page, use `iframe`.

## Examples

### Example 1: video with two formats and captions

```html
<figure>
  <!-- width and height reserve the box before the poster loads. -->
  <video controls width="640" height="360"
         poster="room-poster.jpg" preload="metadata">
    <!-- Order matters: the browser takes the first file it can play. -->
    <source src="room-tour.webm" type="video/webm">
    <source src="room-tour.mp4" type="video/mp4">

    <!-- Captions on by default, because the tour has speech. -->
    <track kind="captions" src="room-tour.en.vtt"
           srclang="en" label="English" default>

    <!-- Fallback for browsers without video support. -->
    <p>
      Your browser cannot play this video.
      <a href="room-tour.mp4">Download the room tour</a> (8 MB).
    </p>
  </video>

  <figcaption>A tour of room 304. Captions available in English.</figcaption>
</figure>
```

### Example 2: audio with chapters and a transcript

```html
<figure>
  <audio controls preload="metadata">
    <source src="interview.mp3" type="audio/mpeg">
    <source src="interview.opus" type="audio/ogg; codecs=opus">

    <!-- Chapters do not need srclang; the label is what the menu shows. -->
    <track kind="chapters" src="interview.chapters.vtt" label="Chapters" default>

    <!-- Audio needs a text path: a download link here, a transcript below. -->
    <p><a href="interview.mp3">Download the interview</a> (12 MB, MP3).</p>
  </audio>

  <figcaption>Interview with the front desk manager, 8 minutes.</figcaption>
</figure>

<!-- The transcript is content, so it stays in the page, not in a caption file. -->
<details>
  <summary>Read the transcript</summary>
  <p><strong>Interviewer:</strong> When does reception close?</p>
  <p><strong>Manager:</strong> At 22:00 on weekdays, and at midnight on Fridays.</p>
</details>
```

The chapters track is a navigation aid, not a replacement for the transcript. A listener who cannot hear still needs the words.

### Example 3: a responsive embedded map

```html
<!-- The wrapper keeps a 16:9 box and the frame fills it at any width. -->
<div class="embed">
  <iframe
    src="/embed/map.html?q=Dock+Street+12"
    title="Map showing Riverside Hotel on Dock Street"
    width="640"
    height="360"
    loading="lazy"
    referrerpolicy="no-referrer"
    sandbox="allow-scripts allow-same-origin allow-popups"
    allow="fullscreen">
  </iframe>
</div>

<p>
  Can't see the map?
  <a href="/embed/map.html?q=Dock+Street+12">Open it in a new page</a>.
</p>
```

```css
.embed {
  aspect-ratio: 16 / 9;
  max-width: 40rem;
}
.embed iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
```

The sandbox here allows scripts and same origin because the map widget is our own document. For a third party widget, drop `allow-same-origin` unless the widget breaks without it, and keep the frame on a separate origin.

### Example 4: a full media page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Riverside Hotel: rooms and location</title>

  <style>
    /* Media never overflows its column. height:auto keeps the aspect ratio. */
    video,
    audio {
      max-width: 100%;
    }
    video {
      height: auto;
    }

    /* The hero video fills the band; the fallback image is hidden by default. */
    .hero {
      position: relative;
      aspect-ratio: 21 / 9;
      overflow: hidden;
      background: #10202f;
    }
    .hero video,
    .hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .hero .hero-fallback {
      display: none;
    }

    /* The pause control sits over the video, bottom right. */
    .hero-toggle {
      position: absolute;
      right: 0.75rem;
      bottom: 0.75rem;
    }

    /* Respect the reduced motion setting: show the still image instead. */
    @media (prefers-reduced-motion: reduce) {
      .hero video,
      .hero-toggle {
        display: none;
      }
      .hero .hero-fallback {
        display: block;
      }
    }

    /* A fixed ratio box for the map frame. */
    .embed {
      aspect-ratio: 16 / 9;
      max-width: 40rem;
    }
    .embed iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  </style>
</head>
<body>
  <header>
    <h1>Riverside Hotel</h1>
  </header>

  <main>
    <!-- Decorative background video: no sound, no controls, hidden from assistive tech. -->
    <div class="hero">
      <video class="hero-video" autoplay muted loop playsinline preload="metadata"
             aria-hidden="true" tabindex="-1">
        <source src="hero.webm" type="video/webm">
        <source src="hero.mp4" type="video/mp4">
      </video>
      <!-- The still image is the fallback and the reduced motion version. -->
      <img class="hero-fallback" src="hero.jpg"
           alt="The hotel terrace at sunset, facing the river"
           width="1600" height="686">
      <!-- Motion that starts on its own still needs a way to stop. -->
      <button type="button" class="hero-toggle">Pause background video</button>
    </div>

    <section aria-labelledby="tour">
      <h2 id="tour">Room tour</h2>

      <!-- The video is content, so it needs controls, captions, and a caption. -->
      <figure>
        <video controls width="640" height="360"
               poster="room-poster.jpg" preload="metadata" playsinline>
          <source src="room-tour.webm" type="video/webm">
          <source src="room-tour.mp4" type="video/mp4">
          <track kind="captions" src="room-tour.en.vtt"
                 srclang="en" label="English" default>
          <track kind="captions" src="room-tour.hu.vtt"
                 srclang="hu" label="Magyar">
          <p>
            Your browser cannot play this video.
            <a href="room-tour.mp4">Download the room tour</a> (8 MB).
          </p>
        </video>
        <figcaption>
          Room 304, the double room with a balcony. Captions in English and Hungarian.
        </figcaption>
      </figure>
    </section>

    <section aria-labelledby="interview">
      <h2 id="interview">Front desk interview</h2>

      <!-- Audio has no poster and no size; the caption carries the context. -->
      <figure>
        <audio controls preload="metadata">
          <source src="interview.mp3" type="audio/mpeg">
          <source src="interview.opus" type="audio/ogg; codecs=opus">
          <track kind="chapters" src="interview.chapters.vtt"
                 label="Chapters" default>
          <p><a href="interview.mp3">Download the interview</a> (12 MB, MP3).</p>
        </audio>
        <figcaption>Eight minutes with the front desk manager.</figcaption>
      </figure>

      <!-- The transcript duplicates the information in text, which is the point. -->
      <details>
        <summary>Read the transcript</summary>
        <p><strong>Interviewer:</strong> When does reception close?</p>
        <p><strong>Manager:</strong> At 22:00 on weekdays, at midnight on Fridays.</p>
        <p><strong>Interviewer:</strong> Is the terrace open in winter?</p>
        <p><strong>Manager:</strong> Only on weekends, weather permitting.</p>
      </details>
    </section>

    <section aria-labelledby="location">
      <h2 id="location">Find us</h2>

      <!-- The frame is named, lazy, and sandboxed. Its own document has its own lang. -->
      <div class="embed">
        <iframe
          src="/embed/map.html?q=Dock+Street+12"
          title="Map showing Riverside Hotel on Dock Street"
          width="640"
          height="360"
          loading="lazy"
          referrerpolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-popups"
          allow="fullscreen">
        </iframe>
      </div>

      <p>
        If the map does not load,
        <a href="/embed/map.html?q=Dock+Street+12">open it in a new page</a>.
      </p>
    </section>
  </main>

  <footer>
    <address>
      Riverside Hotel<br>
      12 Dock Street<br>
      <a href="tel:+3612345678">+36 1 234 5678</a>
    </address>
  </footer>

  <script>
    // WCAG 2.2.2: motion that starts by itself needs a way to stop.
    const heroVideo = document.querySelector('.hero-video');
    const heroToggle = document.querySelector('.hero-toggle');

    heroToggle.addEventListener('click', () => {
      const playing = !heroVideo.paused;

      if (playing) {
        heroVideo.pause();
      } else {
        heroVideo.play();
      }

      // The label names the next action, not the current state.
      heroToggle.textContent = playing
        ? 'Play background video'
        : 'Pause background video';
    });
  </script>
</body>
</html>
```

Read the order of decisions in that page. The hero video is decoration, so it is muted, looped, hidden from assistive technology, paired with a pause button, and replaced by a still image when the user asks for reduced motion. The room tour carries information, so it gets controls, two formats, captions in two languages, a poster and a fallback download. The interview is audio only, so it gets chapters plus a transcript. The map is a separate document, so it gets a title, a sandbox and a direct link for anyone who cannot use the frame.

## Common mistakes

- `autoplay` with sound. Browsers block it, and where it works it interrupts screen readers and startles the user.
- `autoplay` without `muted` and without a pause control. Moving content that lasts more than five seconds needs a way to stop it.
- Omitting `controls` on a video the user is meant to watch. The element becomes a still frame.
- Two `source` elements with no `type`, so the browser downloads a file it cannot play before trying the next one.
- Assuming the `source` list retries on a network error. It does not.
- Leaving the fallback paragraph out, so a browser without support shows nothing at all.
- A `track` with no `default` and no visible captions menu in the design, so nobody ever turns captions on.
- A caption file served as `text/plain`, or the video and track on different origins without `crossorigin="anonymous"`, so captions never load.
- Using `kind="subtitles"` for a video with no audible dialogue, when the track is really captions.
- Shipping an audio player with no transcript and no download link.
- Missing `playsinline`, so iOS opens the video fullscreen when the page wanted it inline.
- `width` and `height` left off, so the layout shifts when the video or frame loads.
- An `iframe` with no `title`, announced only as "frame".
- `sandbox="allow-scripts allow-same-origin"` on untrusted content, which effectively removes the sandbox.
- `loading="lazy"` on a frame at the top of the page, which delays the most important content.
- Using an `iframe` for the site header, navigation or the whole page.
- Framing your own authenticated pages without `frame-ancestors`, which allows clickjacking.
- Setting only CSS width on an `iframe` and no height, so the frame collapses to 150 pixels.
- Using `embed` or `object` for video in a modern page.

## Exam checklist

1. Media that the user must watch or hear has `controls`.
2. Decorative background video is muted, has no controls, is hidden from assistive technology, and respects reduced motion.
3. `video` has `width` and `height`, and usually `poster`.
4. Each `source` has a correct `type`, and the list covers at least MP4 plus one alternative.
5. Fallback text with a download link sits inside `video` and `audio`.
6. Every talking video has a `captions` track with `srclang`, a `label`, and `default` where appropriate.
7. Captions are served as `text/vtt`, and cross origin tracks use `crossorigin="anonymous"`.
8. Audio has a transcript on the page or a link to one.
9. No autoplay with sound, and any moving content over five seconds can be paused.
10. `iframe` has a descriptive `title`, `width`, `height` and, when below the fold, `loading="lazy"`.
11. `iframe` uses `sandbox` with the narrowest set of tokens that still works, never scripts plus same origin for untrusted content.
12. Embedded content has a direct link as an alternative.
13. Frames and media are responsive through CSS, without overflow and without layout shift.
14. The page is operable with the keyboard alone, and the media and frames appear in a sensible tab order.

