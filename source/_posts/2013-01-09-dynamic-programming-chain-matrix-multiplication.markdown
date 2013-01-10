---
layout: post
title: "Dynamic Programming: Chain Matrix Multiplication"
date: 2013-01-09 16:43
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
   });
</script>


<div id="slides">
  <div>
    <h2> Preliminaries </h2>
    <h4>Notation</h4>
    <ul>
      <li>The symbol 'X' will be used to signify multiplying two matricies together.</li>
      <li>The symbol '*' will be used to signify multiplying two integers together.</li>
      <li>Z<sub>a,b</sub> will be used to signify the cost of multiplying all the matricies
      from Matrix a to Matrix b together in the optimal order.</li>
    </ul>
  </div>
  <div>
    <h2> Preliminaries 2</h2>
    <h4>Prerequisite Math Facts</h4>
    <ul>
      <li>A<sub>p x q</sub> X B<sub>q x r</sub> will take p*q*r operations,
      where A is a matrix with p rows and q columns and B is a matrix with q rows and r columns.</li>
      <li>Matrix multiplication is associative, so A X (B X C) == (A X B) X C.</li>
      <li>Multiplying A<sub>p x q</sub> X B<sub>q x r</sub> will yield the matrix C<sub> p x r</sub>.</li>
    </ul>
  </div>
  <div>
    <h2> Preliminaries 3</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>X</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
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
      We will use this table to keep track of the cost of multiplying matricies.
      Notice that the diagonals are all 0; it's because we won't be multiplying a matrix
      by itself.  The boxes with hyphens will be ignored because matrix multiplication works
      from left to right, not the other way around.  Element Z<sub>a,b</sub> in the table
      will be the cost of multiplying all the matricies between a and b.  Getting the 
      top right corner box will give us our final answer.
    </p>
  </div>
  <div>
    <h2> Preliminaries 4</h2>
    <div id="dimension">
      <h4 id="tablehead">Dimensions Table</h4>
      <table>
        <tr>
          <th>X</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
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
    <h4>Game Time!</h4>
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
      Suppose we want to multiply the matricies M<sub>1</sub> X M<sub>2</sub> X M<sub>3</sub> X M<sub>4</sub> X M<sub>5</sub>.
      What is the optimal factorization (technical term for order of multiplying matricies) for this problem?  
      Let's do this!
    </p>

  </div>
  <div>
    <h2> Round 1</h2>
    <div id="cost">
      <h4 id="tablehead">Cost Table</h4>
      <table>
        <tr>
          <th>X</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
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
          <th>X</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
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
      First, we start by keeping track of all the possible combinations of multiplying 2 matricies.
      Remember, we are not allowed to switch the order of the matricies, so there are only 4 combinations.
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
          <td>M<sub>1</sub> X M<sub>2</sub> </td>
          <td>3*4*2 = 24</td>
          <td>3 x 2</td>
        </tr>
        <tr>
          <td>Z<sub>2,3</sub></td>
          <td>M<sub>2</sub> X M<sub>3</sub> </td>
          <td>4*2*3 = 24</td>
          <td>4 x 3</td>
        </tr>
        <tr>
          <td>Z<sub>3,4</sub></td>
          <td>M<sub>3</sub> X M<sub>4</sub> </td>
          <td>2*3*6 = 36</td>
          <td>2 x 6</td>
        </tr>
        <tr>
          <td>Z<sub>4,5</sub></td>
          <td>M<sub>4</sub> X M<sub>5</sub> </td>
          <td>3*6*5 = 90</td>
          <td>3 x 5</td>
        </tr>
      </table>
    </div>
  </div>
  <div>
  </div>

</div>

<p>
  The purpose of this post is to show a fully worked out example
  of Chain Matrix Multiplication using dynamic programming, a fancy
  term for breaking a big problem down into subproblems.
</p>
<p>
  There are multiple sources online with great proofs, source code,
  and explaination of those proofs, but I did not find an example problem that
  I felt was easy to understand and follow.
  I hope that the proofs become much easier to understand having seen this problem.
</p>
<p>
  You may be wondering "What is my motivation for doing this problem using <em>Dynamic Programming</em> 
  when I could just as easily multiply the matricies in order and be done with it?".  Well, suppose that 
  the matricies are really big; as in, each matrix was a couple of hundred columns and rows.  
  Ordinary matrix multiplication is an Θ(n<sup>3</sup>) operation, so it will take many operations.  
  It just so happens that the order in which you multiply matricies makes a huge difference in the number of 
  calculations you have to do.  That's why we look for the optimal order (technical term is factorization)  of multiplication.
</p>

