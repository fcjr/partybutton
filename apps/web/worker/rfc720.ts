// RFC 720 — a joke standard for parties, rendered in the classic RFC HTML style
// used by rfc-editor.org / datatracker.ietf.org.
export const rfc720Html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RFC 720 - A Standard for the Transmission of Parties over Recurse Networks</title>
<style>
  :root { color-scheme: light dark; }
  body {
    background: #fff;
    color: #000;
    margin: 0;
    padding: 2em 1em 4em;
    font-family: "Noto Sans Mono", "Courier New", monospace;
  }
  .doc {
    max-width: 76ch;
    margin: 0 auto;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.35;
    margin: 0;
  }
  a { color: #0b57d0; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .grey { color: #7f7f7f; }
  .grey a { color: #7f7f7f; }
  .h1 { font-weight: 700; }
  .h2, .h3 { font-weight: 700; }
  a.selflink { color: inherit; }
  hr.noprint { border: 0; border-top: 1px solid #ddd; margin: 0; }
  pre.newpage { padding-top: 1.2em; }
  .banner {
    max-width: 76ch;
    margin: 0 auto 1.5em;
    padding: 0.5em 0.9em;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #f8fafc;
    font-family: "Inter", system-ui, sans-serif;
    font-size: 13px;
    color: #475569;
    display: flex;
    justify-content: space-between;
    gap: 1em;
    flex-wrap: wrap;
  }
  .banner strong { color: #0f172a; }
  @media (prefers-color-scheme: dark) {
    body { background: #0d1117; color: #c9d1d9; }
    a { color: #58a6ff; }
    .grey, .grey a { color: #6e7681; }
    hr.noprint { border-top-color: #30363d; }
    .banner { background: #161b22; border-color: #30363d; color: #8b949e; }
    .banner strong { color: #e6edf3; }
  }
</style>
</head>
<body>
<div class="banner">
  <span><strong>RFC 720</strong> &nbsp; A Standard for the Transmission of Parties over Recurse Networks</span>
  <span>Category: Best Current Party &nbsp;|&nbsp; ISSN: 2077-0720</span>
</div>
<div class="doc">
<pre>
Recurse Working Group                                     F. Chiarulli Jr.
Request for Comments: 720                                   Recurse Center
Category: Best Current Party                                      D. Iltis
ISSN: 2077-0720                                             Recurse Center
                                                                July 2026


        <span class="h1">A Standard for the Transmission of Parties over Recurse Networks</span>

Status of this Memo

   This memo documents an Internet Best Current Party for the Recurse
   Community.  Distribution of this memo is unlimited.

   This document is a product of the Recurse Working Group.  It has
   received rough consensus and running breakfast food.  A formal
   objection was raised by exactly one (1) participant, a mustachioed
   individual who declined to elaborate, distrusts committees on
   principle, and asked that his objection not be entered into any
   permanent record.  It was entered into the permanent record.

Abstract

   This document specifies the Party Mode Protocol (PMP), a stateless
   mechanism for signaling, propagating, and integrating parties across
   heterogeneous devices.  A party, for the purposes of this document,
   is a distributed system in which two or more nodes agree to have a
   good time.  PMP defines what a party is, how a compliant party is
   signaled, and how new hardware may be built to integrate with the
   Party API.  Implementers are entitled to treat themselves.

<span class="h2"><a class="selflink" id="section-1" href="#section-1">1</a>.  Introduction</span>

   The Internet has grown beyond anyone's expectations.  So has the
   party.  For decades, celebrations were confined to a single physical
   locality -- a mid-sized town, first in friendship -- addressable only
   by physically attending the local diner and ordering all of the
   available breakfast food.  This does not scale.

   This document describes the transmission of parties over Recurse
   networks.  Whereas RFC 1149 [<a href="#ref-RFC1149">RFC1149</a>] specified the transmission of
   IP datagrams over avian carriers, this document specifies the
   transmission of a single boolean -- <span class="h3">party</span> -- over ordinary IP,
   which turns out to be considerably more reliable than a pigeon.

   The cost of using the party address space is the potentially costly
   effort of cleaning up afterward.  This document does not specify
   cleanup procedures.  The one working-group member qualified to
   handle cleanup was busy privately building a canoe.

<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 1]</span></pre>
<hr class="noprint"><pre class="newpage"><span id="page-2"></span>
<span class="grey"><a href="#">RFC 720</a>              Transmission of Parties                July 2026</span>


<span class="h2"><a class="selflink" id="section-2" href="#section-2">2</a>.  Requirements Language</span>

   The key words "MUST", "MUST NOT", "SHOULD", "SHOULD NOT", and
   "LITERALLY" in this document are to be interpreted as described in
   RFC 2119 [<a href="#ref-RFC2119">RFC2119</a>], with the following clarifications:

      "MUST" indicates an absolute requirement; e.g., a party MUST have
      snacks.

      "SHOULD" indicates a strong recommendation that MAY be overridden
      only in the direction of more bacon.

      "LITERALLY", when emitted by an overly enthusiastic node, indicates
      that the requirement is, literally, the single most important
      requirement in the entire document.  Every requirement so marked
      is also the single most important requirement in the document.

<span class="h2"><a class="selflink" id="section-3" href="#section-3">3</a>.  What Is a Party?</span>

   For the purposes of this document, a <span class="h3">party</span> is a stateful boolean
   condition shared by a set of consenting nodes.  A party has exactly
   two valid states:

      party mode: ON   -- the network is celebrating.
      party mode: off  -- the network is, regrettably, working.

   Nodes MUST NOT assume a third state.  There is no "kind of a party."
   A conforming deployment orders its priorities as friends, breakfast
   food, and work -- in that order, and never work first.

   A conforming party SHOULD exhibit the following properties:

      o  It MUST be discoverable by any node via a single unauthenticated
         GET (see Section <a href="#section-5">5</a>).  Everyone is invited.

      o  It MUST be toggleable only by a node in possession of the party
         key (see Section <a href="#section-6">6</a>).  Not everyone gets the aux cord.

      o  It SHOULD have a house band, whose name is expected to change
         more frequently than its lineup.  Content negotiation between
         band names is out of scope.

      o  It MAY, at the operator's discretion, feature a small horse of
         outsized sentimental value.  Deployments SHOULD budget
         approximately five thousand (5,000) candles against its
         eventual and deeply felt loss.

<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 2]</span></pre>
<hr class="noprint"><pre class="newpage"><span id="page-3"></span>
<span class="grey"><a href="#">RFC 720</a>              Transmission of Parties                July 2026</span>


<span class="h2"><a class="selflink" id="section-4" href="#section-4">4</a>.  Party Roles</span>

   Every conforming party defines the following roles.  A single node
   MAY hold more than one role, except where prohibited by good taste.

      Organizer:      Maintains authoritative party state.  Is over-
                      prepared, keeps an enormous binder, and MUST care
                      about the party more than every other node
                      combined.

      Hype Node:      Amplifies the party signal.  Emits at high volume
                      and low information, offers style in place of
                      substance, and SHOULD be rate-limited.  Frequently
                      proposes a second, worse party immediately.

      Compliance:     Objects to the party on principle, attends anyway,
                      and quietly ensures the meat is handled correctly.
                      Serves as the party's circuit breaker.  Distrusts
                      the organizer's enthusiasm and all public records.

      Affirmation:    A warm, universally-liked node whose primary
                      function is to tell the other nodes they are doing
                      a good job.  Non-normative but load-bearing;
                      removing it causes emotional 500s in its neighbors.

      Fallback:       Absorbs blame for every dropped packet, whether or
                      not at fault.  Appears in the logs under a rotating
                      set of slightly incorrect names; implementations
                      MUST accept all of them as referring to one node.

<span class="h2"><a class="selflink" id="section-5" href="#section-5">5</a>.  The Party API</span>

   PMP is exposed as a small HTTP API.  All parties are addressable at a
   well-known base and speak <span class="h3">application/json</span>.

<span class="h3">5.1.  Reading Party State</span>

   Any node MAY query the current party state.  This request is public;
   requiring authentication merely to learn whether a party exists would
   be a regrettable fast-food decision of an idea.

       GET /api/v1/party

       200 OK
       {
         "party": false,
         "updatedAt": "2026-07-17T00:00:00.000Z"
       }

   The "party" field is the celebration boolean.  The "updatedAt" field
   is the timestamp of the most recent state transition, or null if the
   party has, tragically, never once happened.

<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 3]</span></pre>
<hr class="noprint"><pre class="newpage"><span id="page-4"></span>
<span class="grey"><a href="#">RFC 720</a>              Transmission of Parties                July 2026</span>


<span class="h3">5.2.  Toggling Party State</span>

   A node in possession of the party key MAY toggle party state.  Each
   call flips the boolean; like the business ventures of a certain
   ambitious hype node, every invocation changes reality and no one is
   entirely sure how.

       POST /api/v1/party
       Authorization: Bearer &lt;party-key&gt;

       200 OK
       {
         "party": true,
         "updatedAt": "2026-07-17T00:00:01.000Z"
       }

   A request bearing no key, or an incorrect key, MUST be rejected:

       401 Unauthorized
       { "error": "invalid party key" }

   Servers MUST compare keys in constant time.  A timing side-channel is
   the single most plausible way an uninvited hype node talks its way
   into the party, and the working group has decided it cannot.

<span class="h2"><a class="selflink" id="section-6" href="#section-6">6</a>.  Building Devices That Integrate the Party API</span>

   This section specifies how new hardware -- lights, buttons, disco
   balls, small-horse-shaped LED fixtures -- integrates with PMP.  The
   reference device is the Recurse Party Button, a physical control
   surface that toggles the boolean and immediately regrets nothing.

   A conforming Party Device:

      1.  MUST hold the party key in local secure storage.  The device
          MUST NOT print the key to a USB serial console, no matter how
          much easier that makes debugging.  (It makes it much easier.)

      2.  SHOULD poll GET /api/v1/party on an interval it can sustain
          indefinitely.  The reference firmware polls every two (2)
          seconds -- fast enough to feel alive, slow enough not to DDoS
          its own party.

      3.  MUST render exactly two output states.  When "party" is true,
          the device SHOULD do something joyful (illuminate, spin, play
          a beloved ballad about a departed small horse).  When false,
          the device SHOULD adopt a posture of quiet disappointment.

      4.  On toggle, the device sends POST with its bearer key.  Devices
          MUST debounce their physical input.  An un-debounced party
          button is indistinguishable from the resting heart rate of an
          extremely positive node.

<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 4]</span></pre>
<hr class="noprint"><pre class="newpage"><span id="page-5"></span>
<span class="grey"><a href="#">RFC 720</a>              Transmission of Parties                July 2026</span>


   6.1.  Reference State Machine

   A minimal conforming device implements the following state machine.
   It has far fewer states, and a far shorter playtime, than a certain
   legendarily overcomplicated board game invented out of boredom.

              +----------------+   party==true    +----------------+
              |   MODE: off    | ---------------&gt; |   MODE: ON     |
              |  (working)     | &lt;--------------- |  (celebrating) |
              +----------------+   party==false   +----------------+
                     |                                    |
                     | key press                          | key press
                     v                                    v
                 POST /party                          POST /party
                 (flip state, tell everyone, treat yourself)

<span class="h2"><a class="selflink" id="section-7" href="#section-7">7</a>.  Security Considerations</span>

   Party state is public; party <span class="h3">control</span> is not.  The party key is the
   sole credential and MUST be protected accordingly.

   Operators are reminded that a node's unsanctioned law-enforcement
   alter-ego -- however convincing the homemade badge -- is not a
   recognized authentication authority, and that the improvised key
   exchange named after two of its participants is not a real protocol.

   Denial-of-service is a genuine concern.  A sufficiently motivated
   adversary (typically an obstructive local official who opposes the
   party for procedural reasons) may attempt to toggle party mode off
   repeatedly.  Rate limiting on the POST path is RECOMMENDED.  The GET
   path is safe to expose; the worst outcome is that everyone learns
   there is a party, which is the entire point.

<span class="h2"><a class="selflink" id="section-8" href="#section-8">8</a>.  IANA Considerations</span>

   IANA is requested to reserve the well-known boolean "party" and to
   register the media type <span class="h3">application/vnd.party+json</span>.  IANA is
   further requested to designate one (1) day per calendar year on which
   operators are contractually obligated to treat themselves.  IANA has
   indicated it will consider the request "after lunch," which the
   editors interpret as tentative approval.

<span class="h2"><a class="selflink" id="section-9" href="#section-9">9</a>.  References</span>

   9.1.  Normative References

   <span id="ref-RFC2119">[RFC2119]</span>  Bradner, S., "Key words for use in RFCs to Indicate
              Requirement Levels", BCP 14, RFC 2119, March 1997.

   <span id="ref-RFC1149">[RFC1149]</span>  Waitzman, D., "A Standard for the Transmission of IP
              Datagrams on Avian Carriers", RFC 1149, April 1990.

<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 5]</span></pre>
<hr class="noprint"><pre class="newpage"><span id="page-6"></span>
<span class="grey"><a href="#">RFC 720</a>              Transmission of Parties                July 2026</span>


   9.2.  Informative References

   [BALLAD]   House Band, "Five Thousand Candles in the Wind", a ballad
              for a small departed horse, self-released.

   [SELFCARE] Working Group, "The Annual Obligation to Treat Oneself",
              observed annually, no fixed date.

   [ENT]      A Hype Node et al., "A Full-Service Entertainment Company
              That Did Everything and Nothing, Briefly, at Great
              Expense", Vol. 720.  (Ceased operation; see also: gift
              bags, courtside seats.)

<span class="h2"><a class="selflink" id="section-10" href="#section-10">10</a>.  Acknowledgements</span>

   The editors thank a certain mid-sized town, first in friendship, and
   the many nodes -- the organizer with the binder, the compliance node
   with the mustache, the relentlessly positive node, and the one whose
   name no one ever quite got right -- without whom this document would
   have neither a table of contents nor a reason to exist.  It is
   dedicated to the small horse.  Bye bye.

<span class="h2"><a class="selflink" id="authors" href="#authors">Authors' Addresses</a></span>

   Frank Chiarulli Jr.
   Recurse Center

   EMail: party@partybutton.recurse.com


   Dana Iltis
   Recurse Center

   EMail: party@partybutton.recurse.com


<span class="grey">Chiarulli, et al.        Best Current Party                     [Page 6]</span></pre>
</div>
</body>
</html>`;
