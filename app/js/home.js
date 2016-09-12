import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Home = () => (
  <Row>
    <Col xs={12}>
      <h1>About the Survey</h1>
      <p>
        The <a href="https://volcrowe.org/">VOLCROWE</a> research project undertook a survey of <a href="https://www.zooniverse.org">Zooniverse</a> users
        during April and May 2015, spanning five different individual projects; <a href="https://www.galaxyzoo.org/">Galaxy Zoo</a>,&nbsp;
        <a href="https://www.planethunters.org/">Planet Hunters</a>, <a href="https://www.snapshotserengeti.org/">Snapshot Serengeti</a>,&nbsp;
        <a href="https://www.seafloorexplorer.org/">Seafloor Explorer</a> and <a href="https://www.penguinwatch.org/">Penguin Watch</a>.
        The survey was entirely web-based and asked a range of questions relating to issues such as the respondent’s socio-demographic status,
        their motivations to volunteer, their levels of social capital and their knowledge of science and politics.  After excluding a very small number of
        incomplete responses, the final dataset comprised a total of 1,913 respondents drawn from across these five projects.
      </p>
      <p>
        As each individual respondent was e-mailed a unique URL, it was possible to reconcile the survey data directly against
        the <a href="https://www.zooniverse.org">Zooniverse</a> database so that each survey response could be matched up against actual historical
        patterns of activity.  This included individual-level measures of the number of classifications supplied, the amount of time actually spent classifying
        and the number of individual projects towards which the volunteer has contributed.
      </p>
      <p>
        As with many voluntary web-based surveys, obtaining a representative sample of users was a primary concern given that we were otherwise
        likely to encounter a disproportionately high number of very active contributors.  To address this, we launched a smaller pilot survey prior to the
        full release where a randomly selected sample of users were invited to respond.  By comparing the number of responses with the number of
        invitees among users demonstrating different levels of engagement, we were able to estimate likely response rates among these groups and
        tailor the invitee list for the full survey in order to maximise the likelihood of obtaining a representative sample.  As can be seen from the histogram
        below, the result is that, aside from an underrepresentation of participants who provide only one or two classifications, the distribution of activity
        (number of classifications submitted) observed among respondents to the survey broadly matches the distribution observed for the whole population
        of <a href="https://www.zooniverse.org">Zooniverse</a> volunteers.
      </p>
      <div className="home__center">
        <h2>
          Distribution of Classifcation Activity
          <br />
          (Zooniverse Population versus Survye Sample)
        </h2>
        <img src="/static/distribution_of_classifications.png" alt="Distribution of Classifcation Activity" />
      </div>
      <br />
      <h2>The Data</h2>
      <p>
        An anonymised version of the full survey dataset is available for public use <a href="http://www.icg.port.ac.uk/~krawcyzc/VOLCROWE_export_all_data.zip" download>here</a>.
        Filtered version of this data are available via the <code>download visible data</code> links on each of the question category pages.  If you use or refer to this data in any way,
        please cite the <a href="https://volcrowe.org/">VOLCROWE</a> project and this website as the original source.  If you intend to use the survey data as part of any academic research,
        please contact the <a href="mailto:joe.cox@port.ac.uk">Principal Investigator</a> so that this can be recorded and acknowledged.  We would also be happy to answer
        any questions you might have and to discuss the possibility of working together on research connected with the data.
      </p>
    </Col>
  </Row>
);

export default Home;
