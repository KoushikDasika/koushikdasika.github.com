---
layout: post
title: "Dynamic Programming: Chain Matrix Multiplication"
date: 2013-01-30 16:43
comments: true
categories: Math, Algorithms
---

<script src="/javascripts/foundation/jquery.js"></script>
<script src="/javascripts/foundation/foundation.min.js"></script>
<script src="/javascripts/foundation/jquery.foundation.orbit.js"></script>
<script src="/javascripts/foundation/jquery.foundation.forms.js"></script>
<script src="/javascripts/foundation/jquery.foundation.mediaQueryToggle.js"></script>
<script src="/javascripts/foundation/modernizr.foundation.js"></script>
<script src="/javascripts/foundation/app.js"></script>

<link rel="stylesheet" type="text/css" href="/stylesheets/foundation/foundation.css">
<link rel="stylesheet" type="text/css" href="/stylesheets/foundation/app.css">

<script type='text/javascript'>
   $(window).load(function() {
     $('#slides').orbit({
       fluid: '1x1',
       timer: false
     });

     $('#contiguous').hide();

     $('#trigger').click(function() {
       $('.slider-nav').toggle();
       $('#slides').toggle();
       $('#contiguous').toggle();
     });
   });
</script>

If you would prefer reading the post as a contiguous block rather than a slide show, <button id="trigger" type="button">Click here</button>

<div id="slides">
  <div>
    <h2> Motivation </h2>
    <p>
      The purpose of this post is to show a fully worked out example
      of Chain Matrix Multiplication using dynamic programming, a fancy
      term for breaking a big problem down into subproblems which are easier to solve. 
      (Note: Not the technical definition)
    </p>
    <p>
      There are multiple sources online with great proofs, source code,
      and explanation of the proofs, but I did not find an example problem that
      I felt was easy to understand and follow.
      I hope that the proofs become much easier to understand after seeing this problem worked out.
    </p>
    <p>
      You may be wondering "What is my motivation for doing this problem using <em>Dynamic Programming</em>
      when I could just as easily multiply the matrices in order and be done with it?".  Well, suppose that
      the matrices are really big; as in, each matrix was a couple of hundred columns and rows.
      Ordinary matrix multiplication is an Θ(n<sup>3</sup>) operation, so it will take many operations.
      It just so happens that the order in which you multiply matrices makes a huge difference in the number of
      calculations you have to do.  That's why we look for the optimal order (technical term is factorization)  of multiplication.
    </p>
  </div>
  <div>
    <h2> Preliminaries </h2>
    <h4>Notation</h4>
    <ul>
      <li>The symbol '×' will be used to signify multiplying two matrices together.</li>
      <li>The symbol '<symbol>&#8901</symbol>' will be used to signify multiplying two integers together.</li>
      <li>Z<sub>a,b</sub> will be used to signify the cost of multiplying all the matrices
      from Matrix a to Matrix b together in the optimal order.</li>
    </ul>
  </div>
  <div>
    <h2> Preliminaries 2</h2>
    <h4>Prerequisite Math Facts</h4>
    <ul>
      <li>A<sub>p x q</sub> × B<sub>q x r</sub> will take p<symbol>&#8901</symbol>q<symbol>&#8901</symbol>r operations,
      where A is a matrix with p rows and q columns and B is a matrix with q rows and r columns.</li>
      <li>Matrix multiplication is associative, so A × (B × C) == (A × B) × C.</li>
      <li>Multiplying A<sub>p x q</sub> × B<sub>q x r</sub> will yield the matrix C<sub> p x r</sub>.</li>
      <li>For matrices A and B, A × B <symbol>&#8800</symbol> B × A</li>
    </ul>
  </div>
  <div>
    <h2> Preliminaries 3</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      We will use this table to keep track of the cost of multiplying matrices.
      Notice that the diagonals are all 0; it's because we won't be multiplying a matrix
      by itself.  The boxes with hyphens will be ignored because matrix multiplication works
      from left to right, not the other way around.  Element Z<sub>a,b</sub> in the table
      will be the cost of multiplying all the matrices between a and b.  Getting the 
      top right corner box will give us our final answer.
    </p>
  </div>
  <div>
    <h2> Preliminaries 4</h2>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      The aptly named dimension table will be used to keep track of the dimensions of the resultant matrix.
    </p>
  </div>

  <div>
    <h2>Game Time!</h2>
    <div id="problem">
      <table>
        <tr>
          <th>Matrix</th>
          <th>Dimensions</th>
        </tr>
        <tr>
          <td>M<sub>1</sub></td>
          <td>3 x 4</td>
        </tr>
          <td>M<sub>2</sub></td>
          <td>4 x 2</td>
        </tr>
          <td>M<sub>3</sub></td>
          <td>2 x 3</td>
        </tr>
          <td>M<sub>4</sub></td>
          <td>3 x 6</td>
        </tr>
          <td>M<sub>5</sub></td>
          <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <p id="problemExp">
        Looks like everything is set.  Looks like we're ready for the problem.
      Suppose we want to multiply the matrices M<sub>1</sub> × M<sub>2</sub> × M<sub>3</sub> × M<sub>4</sub> × M<sub>5</sub>.
      What is the optimal factorization (technical term for order of multiplying matrices) for this problem?  
      Let's do this!
    </p>

  </div>
  <div>
    <h2> Round 1</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>

    <p>
      First, we start by keeping track of all the possible combinations of multiplying 2 matrices.
      Remember, we are not allowed to switch the order of the matrices, so there are only 4 combinations.
    </p>

    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Resulting Dimension</th>
        </tr>
        <tr>
          <td>Z<sub>1,2</sub></td>
          <td>M<sub>1</sub> × M<sub>2</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>2 = 24</td>
          <td>3 x 2</td>
        </tr>
        <tr>
          <td>Z<sub>2,3</sub></td>
          <td>M<sub>2</sub> × M<sub>3</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>3 = 24</td>
          <td>4 x 3</td>
        </tr>
        <tr>
          <td>Z<sub>3,4</sub></td>
          <td>M<sub>3</sub> × M<sub>4</sub> </td>
          <td>2<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 36</td>
          <td>2 x 6</td>
        </tr>
        <tr>
          <td>Z<sub>4,5</sub></td>
          <td>M<sub>4</sub> × M<sub>5</sub> </td>
          <td>3<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 90</td>
          <td>3 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      With that, we've completed round one.  We update our costs and dimensions tables and we're ready for round 2.
    </p>
  </div>

  <div>
    <h2> Round 2 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      From here on out, we will start heavily using our tables.  For round 2, we will
      start looking at cost of multiplying 3 matrices together: Z<sub>1,3</sub>, 
      Z<sub>2,4</sub>, and Z<sub>3,5</sub>.
    </p>
    <p>
      For Z<sub>1,3</sub>, we want the min{(M<sub>1</sub> × M<sub>2</sub>) × M<sub>3</sub> 
      , M<sub>1</sub> × (M<sub>2</sub> × M<sub>3</sub>)}.
      <br />
      We can rewrite that as min{Z<sub>1,2</sub> × M<sub>3</sub>,
      M<sub>1</sub> × Z<sub>2,3</sub>)}. Now we recognize the values from the table.  
      <h3> An important point is that when we do the calculation of cost of Z<sub>1,2</sub> × M<sub>3</sub>, we have to find the cost of multiplying
      Z<sub>1,2</sub> × M<sub>3</sub> and we have to add to that the cost of Z<sub>1,2</sub>, which is 24. </h3>
      We have to do this for each of the remaining 2 combinations.  We will end up doing 6 subproblems.
    </p>
  </div>

  <div>
    <h2> Round 2 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Shorthand</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,3</sub></td>
          <td>(M<sub>1</sub> × M<sub>2</sub>) × M<sub>3</sub> </td>
          <td>Z<sub>1,2</sub> × M<sub>3</sub> </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>3 = 18</td>
          <td>18 + 24 = 42</td>
          <td>3 x 3</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,3</sub></td>
          <td>M<sub>1</sub> × (M<sub>2</sub> × M<sub>3</sub>)</td>
          <td> M<sub>1</sub> × Z<sub>2,3</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>3 = 36</td>
          <td>36 + 24 = 50</td>
          <td>3 x 3</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,4</sub></td>
          <td>(M<sub>2</sub> × M<sub>3</sub>) × M<sub>4</sub> </td>
          <td>Z<sub>2,3</sub> × M<sub>4</sub> </td>
          <td>4<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 72</td>
          <td>72 + 24 = 96</td>
          <td>4 x 6</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,4</sub></td>
          <td>M<sub>2</sub> × (M<sub>3</sub> × M<sub>4</sub>)</td>
          <td> M<sub>2</sub> × Z<sub>3,4</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>6 = 48</td>
          <td>36 + 48 = 84</td>
          <td>4 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>3,5</sub></td>
          <td>(M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub> </td>
          <td>Z<sub>3,4</sub> × M<sub>5</sub> </td>
          <td>2<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 60</td>
          <td>36 + 60 = 96</td>
          <td>2 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>3,5</sub></td>
          <td>M<sub>3</sub> × (M<sub>4</sub> × M<sub>5</sub>)</td>
          <td> M<sub>3</sub> × Z<sub>4,5</sub> </td>
          <td>2<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 30</td>
          <td>30 + 90 = 120</td>
          <td>2 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      With that, we're finished with round 2.  We just update our cost and dimension tables 
      with the values with the check marks, and we're ready for round 3.
    </p>
  </div>
  <div>
    <h2> Round 3 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      For round 3, we're finding all the possible ways to multiply 
      4 matrices without changing their order.  Our goal is to fill in Z<sub>1,4</sub>
      and Z<sub>2,5</sub>.  Let's start with Z<sub>1,4</sub>. <br />
    </p>
    <p style="text-align: center;">
      Z<sub>1,4</sub> = min{ M<sub>1</sub> × Z<sub>2,4</sub>, 
      Z<sub>1,2</sub> × Z<sub>3,4</sub>,
      Z<sub>1,3</sub> × M<sub>4</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td> M<sub>1</sub> × Z<sub>2,4</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>6 = 72</td>
          <td>72 + 84 = 156</td>
          <td>3 x 6</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td>Z<sub>1,2</sub> × Z<sub>3,4</sub>  </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>6 = 36</td>
          <td>24 + 36 + 36 = 96</td>
          <td>3 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td>Z<sub>1,3</sub> × M<sub>4</sub> </td>
          <td>3<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 54</td>
          <td>42 + 54 = 96</td>
          <td>3 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
      </table>
    </div>
    <p>
      Notice that two of the solutions have the same cost.
      This means that either ordering is equally optimal way to factorize 
      multiplication for Z<sub>1,4</sub>.
    </p>
  </div>

  <div>
    <h2> Round 3 Part 2</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      Now we're doing Z<sub>2,5</sub>.
    </p>
    <p style="text-align: center;">
      Z<sub>2,5</sub> = min{ M<sub>2</sub> × Z<sub>3,5</sub>, 
      Z<sub>2,3</sub> × Z<sub>4,5</sub>,
      Z<sub>2,4</sub> × M<sub>5</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td> M<sub>2</sub> × Z<sub>3,5</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>5 = 40</td>
          <td>40 + 96 = 136</td>
          <td>4 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td>Z<sub>2,3</sub> × Z<sub>4,5</sub>  </td>
          <td>4<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 60</td>
          <td>60 + 24 + 90 = 174</td>
          <td>4 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td>Z<sub>2,4</sub> × M<sub>5</sub> </td>
          <td>4<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 120</td>
          <td>84 + 120 = 204</td>
          <td>4 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      With that, we're done with round 3.  Time for the last round!
    </p>
  </div>
  <div>
    <h2> Final Round!</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>136</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>4 x 5</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      As with any good final boss battle, this one will have the most parts.
    </p>
    <p style="text-align: center;">
      Z<sub>1,5</sub> = min{ M<sub>1</sub> × Z<sub>2,5</sub>, 
      Z<sub>1,2</sub> × Z<sub>3,5</sub>,
      Z<sub>1,3</sub> × Z<sub>4,5</sub>,
      Z<sub>1,4</sub> × M<sub>5</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td> M<sub>1</sub> × Z<sub>2,5</sub> </td>
          <td>2<symbol>&#8901</symbol>4<symbol>&#8901</symbol>5 = 60</td>
          <td>60 + 136 = 196</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,2</sub> × Z<sub>3,5</sub>  </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>5 = 30</td>
          <td>30 + 24 + 96 = 150</td>
          <td>3 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,3</sub> × Z<sub>4,5</sub>  </td>
          <td>3<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 45</td>
          <td>45 + 42 + 90 = 177</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,4</sub> × M<sub>5</sub> </td>
          <td>3<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 90</td>
          <td>96 + 90 = 186</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      So we found that the best factorization for this problm is Z<sub>1,2</sub> × Z<sub>3,5</sub> and the total cost is 150.
    </p>
  </div>
  <div>
    <h2>Final Credits</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>150</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>136</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>3 x 5</t>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>4 x 5</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      So we found that the best factorization for this problm is Z<sub>1,2</sub> × Z<sub>3,5</sub> and the total cost is 150.
      <br />
      Recall from round 1 that Z<sub>1,2</sub> is M<sub>1</sub> × M<sub>2</sub>.
      <br />
      Also recall from round 2 that Z<sub>3,5</sub> is (M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub>.
      <br />
      So the best factorization of these matrices is (M<sub>1</sub> × M<sub>2</sub>) × ((M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub>).
      And with that, we're done! Thanks for reading!
    </p>
  </div>
</div>

<div id="contiguous">
    <h2> Motivation </h2>
    <p>
      The purpose of this post is to show a fully worked out example
      of Chain Matrix Multiplication using dynamic programming, a fancy
      term for breaking a big problem down into subproblems which are easier to solve. 
      (Note: Not the technical definition)
    </p>
    <p>
      There are multiple sources online with great proofs, source code,
      and explanation of the proofs, but I did not find an example problem that
      I felt was easy to understand and follow.
      I hope that the proofs become much easier to understand after seeing this problem worked out.
    </p>
    <p>
      You may be wondering "What is my motivation for doing this problem using <em>Dynamic Programming</em>
      when I could just as easily multiply the matrices in order and be done with it?".  Well, suppose that
      the matrices are really big; as in, each matrix was a couple of hundred columns and rows.
      Ordinary matrix multiplication is an Θ(n<sup>3</sup>) operation, so it will take many operations.
      It just so happens that the order in which you multiply matrices makes a huge difference in the number of
      calculations you have to do.  That's why we look for the optimal order (technical term is factorization)  of multiplication.
    </p>
    <h2> Preliminaries </h2>
    <h4>Notation</h4>
    <ul>
      <li>The symbol '×' will be used to signify multiplying two matrices together.</li>
      <li>The symbol '<symbol>&#8901</symbol>' will be used to signify multiplying two integers together.</li>
      <li>Z<sub>a,b</sub> will be used to signify the cost of multiplying all the matrices
      from Matrix a to Matrix b together in the optimal order.</li>
    </ul>
    <h2> Preliminaries 2</h2>
    <h4>Prerequisite Math Facts</h4>
    <ul>
      <li>A<sub>p x q</sub> × B<sub>q x r</sub> will take p<symbol>&#8901</symbol>q<symbol>&#8901</symbol>r operations,
      where A is a matrix with p rows and q columns and B is a matrix with q rows and r columns.</li>
      <li>Matrix multiplication is associative, so A × (B × C) == (A × B) × C.</li>
      <li>Multiplying A<sub>p x q</sub> × B<sub>q x r</sub> will yield the matrix C<sub> p x r</sub>.</li>
      <li>For matrices A and B, A × B <symbol>&#8800</symbol> B × A</li>
    </ul>
    <h2> Preliminaries 3</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      We will use this table to keep track of the cost of multiplying matrices.
      Notice that the diagonals are all 0; it's because we won't be multiplying a matrix
      by itself.  The boxes with hyphens will be ignored because matrix multiplication works
      from left to right, not the other way around.  Element Z<sub>a,b</sub> in the table
      will be the cost of multiplying all the matrices between a and b.  Getting the 
      top right corner box will give us our final answer.
    </p>
    <h2> Preliminaries 4</h2>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      The aptly named dimension table will be used to keep track of the dimensions of the resultant matrix.
    </p>
    <h2>Game Time!</h2>
    <div id="problem">
      <table>
        <tr>
          <th>Matrix</th>
          <th>Dimensions</th>
        </tr>
        <tr>
          <td>M<sub>1</sub></td>
          <td>3 x 4</td>
        </tr>
          <td>M<sub>2</sub></td>
          <td>4 x 2</td>
        </tr>
          <td>M<sub>3</sub></td>
          <td>2 x 3</td>
        </tr>
          <td>M<sub>4</sub></td>
          <td>3 x 6</td>
        </tr>
          <td>M<sub>5</sub></td>
          <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <p id="problemExp">
        Looks like everything is set.  Looks like we're ready for the problem.
      Suppose we want to multiply the matrices M<sub>1</sub> × M<sub>2</sub> × M<sub>3</sub> × M<sub>4</sub> × M<sub>5</sub>.
      What is the optimal factorization (technical term for order of multiplying matrices) for this problem?  
      Let's do this!
    </p>
    <h2> Round 1</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>?</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>

    <p>
      First, we start by keeping track of all the possible combinations of multiplying 2 matrices.
      Remember, we are not allowed to switch the order of the matrices, so there are only 4 combinations.
    </p>

    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Resulting Dimension</th>
        </tr>
        <tr>
          <td>Z<sub>1,2</sub></td>
          <td>M<sub>1</sub> × M<sub>2</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>2 = 24</td>
          <td>3 x 2</td>
        </tr>
        <tr>
          <td>Z<sub>2,3</sub></td>
          <td>M<sub>2</sub> × M<sub>3</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>3 = 24</td>
          <td>4 x 3</td>
        </tr>
        <tr>
          <td>Z<sub>3,4</sub></td>
          <td>M<sub>3</sub> × M<sub>4</sub> </td>
          <td>2<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 36</td>
          <td>2 x 6</td>
        </tr>
        <tr>
          <td>Z<sub>4,5</sub></td>
          <td>M<sub>4</sub> × M<sub>5</sub> </td>
          <td>3<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 90</td>
          <td>3 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      With that, we've completed round one.  We update our costs and dimensions tables and we're ready for round 2.
    </p>
    <h2> Round 2 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      From here on out, we will start heavily using our tables.  For round 2, we will
      start looking at cost of multiplying 3 matrices together: Z<sub>1,3</sub>, 
      Z<sub>2,4</sub>, and Z<sub>3,5</sub>.
    </p>
    <p>
      For Z<sub>1,3</sub>, we want the min{(M<sub>1</sub> × M<sub>2</sub>) × M<sub>3</sub> 
      , M<sub>1</sub> × (M<sub>2</sub> × M<sub>3</sub>)}.
      <br />
      We can rewrite that as min{Z<sub>1,2</sub> × M<sub>3</sub>,
      M<sub>1</sub> × Z<sub>2,3</sub>)}. Now we recognize the values from the table.  
      <h3> An important point is that when we do the calculation of cost of Z<sub>1,2</sub> × M<sub>3</sub>, we have to find the cost of multiplying
      Z<sub>1,2</sub> × M<sub>3</sub> and we have to add to that the cost of Z<sub>1,2</sub>, which is 24. </h3>
      We have to do this for each of the remaining 2 combinations.  We will end up doing 6 subproblems.
    </p>
    <h2> Round 2 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>?</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Shorthand</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,3</sub></td>
          <td>(M<sub>1</sub> × M<sub>2</sub>) × M<sub>3</sub> </td>
          <td>Z<sub>1,2</sub> × M<sub>3</sub> </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>3 = 18</td>
          <td>18 + 24 = 42</td>
          <td>3 x 3</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,3</sub></td>
          <td>M<sub>1</sub> × (M<sub>2</sub> × M<sub>3</sub>)</td>
          <td> M<sub>1</sub> × Z<sub>2,3</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>3 = 36</td>
          <td>36 + 24 = 50</td>
          <td>3 x 3</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,4</sub></td>
          <td>(M<sub>2</sub> × M<sub>3</sub>) × M<sub>4</sub> </td>
          <td>Z<sub>2,3</sub> × M<sub>4</sub> </td>
          <td>4<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 72</td>
          <td>72 + 24 = 96</td>
          <td>4 x 6</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,4</sub></td>
          <td>M<sub>2</sub> × (M<sub>3</sub> × M<sub>4</sub>)</td>
          <td> M<sub>2</sub> × Z<sub>3,4</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>6 = 48</td>
          <td>36 + 48 = 84</td>
          <td>4 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>3,5</sub></td>
          <td>(M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub> </td>
          <td>Z<sub>3,4</sub> × M<sub>5</sub> </td>
          <td>2<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 60</td>
          <td>36 + 60 = 96</td>
          <td>2 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>3,5</sub></td>
          <td>M<sub>3</sub> × (M<sub>4</sub> × M<sub>5</sub>)</td>
          <td> M<sub>3</sub> × Z<sub>4,5</sub> </td>
          <td>2<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 30</td>
          <td>30 + 90 = 120</td>
          <td>2 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      With that, we're finished with round 2.  We just update our cost and dimension tables 
      with the values with the check marks, and we're ready for round 3.
    </p>
    <h2> Round 3 </h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>?</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      For round 3, we're finding all the possible ways to multiply 
      4 matrices without changing their order.  Our goal is to fill in Z<sub>1,4</sub>
      and Z<sub>2,5</sub>.  Let's start with Z<sub>1,4</sub>. <br />
    </p>
    <p style="text-align: center;">
      Z<sub>1,4</sub> = min{ M<sub>1</sub> × Z<sub>2,4</sub>, 
      Z<sub>1,2</sub> × Z<sub>3,4</sub>,
      Z<sub>1,3</sub> × M<sub>4</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td> M<sub>1</sub> × Z<sub>2,4</sub> </td>
          <td>3<symbol>&#8901</symbol>4<symbol>&#8901</symbol>6 = 72</td>
          <td>72 + 84 = 156</td>
          <td>3 x 6</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td>Z<sub>1,2</sub> × Z<sub>3,4</sub>  </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>6 = 36</td>
          <td>24 + 36 + 36 = 96</td>
          <td>3 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,4</sub></td>
          <td>Z<sub>1,3</sub> × M<sub>4</sub> </td>
          <td>3<symbol>&#8901</symbol>3<symbol>&#8901</symbol>6 = 54</td>
          <td>42 + 54 = 96</td>
          <td>3 x 6</td>
          <td></code>&#x2713;</code></td>
        </tr>
      </table>
    </div>
    <p>
      Notice that two of the solutions have the same cost.
      This means that either ordering is equally optimal way to factorize 
      multiplication for Z<sub>1,4</sub>.
    </p>
    <h2> Round 3 Part 2</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      Now we're doing Z<sub>2,5</sub>.
    </p>
    <p style="text-align: center;">
      Z<sub>2,5</sub> = min{ M<sub>2</sub> × Z<sub>3,5</sub>, 
      Z<sub>2,3</sub> × Z<sub>4,5</sub>,
      Z<sub>2,4</sub> × M<sub>5</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td> M<sub>2</sub> × Z<sub>3,5</sub> </td>
          <td>4<symbol>&#8901</symbol>2<symbol>&#8901</symbol>5 = 40</td>
          <td>40 + 96 = 136</td>
          <td>4 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td>Z<sub>2,3</sub> × Z<sub>4,5</sub>  </td>
          <td>4<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 60</td>
          <td>60 + 24 + 90 = 174</td>
          <td>4 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>2,5</sub></td>
          <td>Z<sub>2,4</sub> × M<sub>5</sub> </td>
          <td>4<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 120</td>
          <td>84 + 120 = 204</td>
          <td>4 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      With that, we're done with round 3.  Time for the last round!
    </p>
    <h2> Final Round!</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>136</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>?</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>4 x 5</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      As with any good final boss battle, this one will have the most parts.
    </p>
    <p style="text-align: center;">
      Z<sub>1,5</sub> = min{ M<sub>1</sub> × Z<sub>2,5</sub>, 
      Z<sub>1,2</sub> × Z<sub>3,5</sub>,
      Z<sub>1,3</sub> × Z<sub>4,5</sub>,
      Z<sub>1,4</sub> × M<sub>5</sub>}
    </p>
    <div id="calculations">
      <table>
        <tr>
          <th>Cell</th>
          <th>Combination</th>
          <th>Calculation</th>
          <th>Total Cost</th>
          <th>Resulting Dimension</th>
          <th> Winner </th>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td> M<sub>1</sub> × Z<sub>2,5</sub> </td>
          <td>2<symbol>&#8901</symbol>4<symbol>&#8901</symbol>5 = 60</td>
          <td>60 + 136 = 196</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,2</sub> × Z<sub>3,5</sub>  </td>
          <td>3<symbol>&#8901</symbol>2<symbol>&#8901</symbol>5 = 30</td>
          <td>30 + 24 + 96 = 150</td>
          <td>3 x 5</td>
          <td></code>&#x2713;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,3</sub> × Z<sub>4,5</sub>  </td>
          <td>3<symbol>&#8901</symbol>3<symbol>&#8901</symbol>5 = 45</td>
          <td>45 + 42 + 90 = 177</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
        <tr>
          <td>Z<sub>1,5</sub></td>
          <td>Z<sub>1,4</sub> × M<sub>5</sub> </td>
          <td>3<symbol>&#8901</symbol>6<symbol>&#8901</symbol>5 = 90</td>
          <td>96 + 90 = 186</td>
          <td>3 x 5</td>
          <td></code>&#x2717;</code></td>
        </tr>
      </table>
    </div>
    <p>
      So we found that the best factorization for this problm is Z<sub>1,2</sub> × Z<sub>3,5</sub> and the total cost is 150.
    </p>
    <h2>Final Credits</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>0</td> <td>24</td> <td>42</td> <td>96</td> <td>150</td>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>0</td> <td>24</td> <td>84</td> <td>136</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>0</td> <td>36</td> <td>96</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td> <td>90</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>0</td>
        </tr>
      </table>
    </div>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>×</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
        </tr>

        <tr>
          <td>1</td> <td>3 x 4</td> <td>3 x 2</td> <td>3 x 3</td> <td>3 x 6</td> <td>3 x 5</t>
        </tr>

        <tr>
          <td>2</td> <td>-</td> <td>4 x 2</td> <td>4 x 3</td> <td>4 x 6</td> <td>4 x 5</td>
        </tr>

        <tr>
          <td>3</td> <td>-</td> <td>-</td> <td>2 x 3</td> <td>2 x 6</td> <td>2 x 5</td>
        </tr>

        <tr>
          <td>4</td> <td>-</td> <td>-</td> <td>-</td> <td>3 x 6</td> <td>3 x 5</td>
        </tr>

        <tr>
          <td>5</td> <td>-</td> <td>-</td> <td>-</td> <td>-</td> <td>6 x 5</td>
        </tr>
      </table>
    </div>
    <br />
    <p>
      So we found that the best factorization for this problm is Z<sub>1,2</sub> × Z<sub>3,5</sub> and the total cost is 150.
      <br />
      Recall from round 1 that Z<sub>1,2</sub> is M<sub>1</sub> × M<sub>2</sub>.
      <br />
      Also recall from round 2 that Z<sub>3,5</sub> is (M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub>.
      <br />
      So the best factorization of these matrices is (M<sub>1</sub> × M<sub>2</sub>) × ((M<sub>3</sub> × M<sub>4</sub>) × M<sub>5</sub>).
      And with that, we're done! Thanks for reading!
    </p>
</div>

<p>
Edit 1: Changed the multiplication symbols to more friendly ones.
Edit 2: Fixed spelling mistakes....I are really good at English :D
</p>
