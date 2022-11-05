import React from "react";

import { Stack, Container, Row, Col, Accordion, Button } from "react-bootstrap";
import { useMatomo } from "@jonkoops/matomo-tracker-react";

import { pushNotification, Notification } from "../stores/notificationStore";

export const Legal = () => {
    const { trackPageView, pushInstruction } = useMatomo();

    function disableTracking() {
        pushInstruction("optUserOut");
        pushNotification(
            new Notification("Disabled Tracking", "success", "Success")
        );
    }

    // Track page view
    React.useEffect(() => {
        trackPageView({
            documentTitle: "Imprint",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs="12" md="9">
                    <Accordion alwaysOpen className="mt-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Privacy Policy</Accordion.Header>
                            <Accordion.Body>
                                <Stack gap={1.3}>
                                    <div>
                                        <h1 className="mb-3">Privacy Policy</h1>
                                    </div>
                                    <div>
                                        <p className="ms-3">
                                            Rostlab (Chair for Bioinformatics
                                            I12) is part of the Technical
                                            University of Munich (TUM). This
                                            privacy policy will explain how we
                                            uses the personal data we collect
                                            from you when you use our website.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            What data do we collect?
                                        </h2>
                                        <p className="ms-3">
                                            We collect the following data:
                                        </p>
                                        <ul>
                                            <li>Sequence Input</li>
                                            <li>
                                                Tracking and Usage Information
                                            </li>
                                        </ul>
                                        <h2 className="mb-3">
                                            How do we collect your data?
                                        </h2>
                                        <p className="ms-3">
                                            You directly provide Rostlab with
                                            most of the data we collect. We
                                            collect data and process data when
                                            you:
                                        </p>
                                        <ul className="ms-3">
                                            <li>
                                                Input a sequence into the
                                                respective field.
                                            </li>
                                            <li>
                                                Use or view our website via your
                                                browser's cookies.
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How will we use your data?
                                        </h2>
                                        <p className="ms-3">
                                            Rostlab collects your data so that
                                            we can:
                                        </p>
                                        <ul className="ms-3 mb-2">
                                            <li>Secure our service.</li>
                                            <li>
                                                Provide prediction results
                                                faster.
                                            </li>
                                            <li>
                                                Improve our service based on
                                                user behavior
                                            </li>
                                        </ul>
                                        <p className="ms-3">
                                            When Rostlab processes your request,
                                            we may send your data to, and also
                                            use the resulting information from,
                                            external services to complete your
                                            input.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How do we store your data?
                                        </h2>
                                        <p className="ms-3">
                                            Rostlab does not store any
                                            information that can connected to
                                            you personally. Any collected data
                                            is stored at servers at the
                                            Technical University of Munich or
                                            the Luxembourg Centre for
                                            SystemsWhat are cookies? maximally a
                                            month after your request. Once this
                                            time period has expired, we will
                                            delete any cached data.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            What are your data protection
                                            rights?
                                        </h2>
                                        <p className="ms-3">
                                            Rostlab would like to make sure you
                                            are fully aware of all of your data
                                            protection rights. Every user is
                                            entitled to the following:
                                            <br />
                                            <br />
                                            <b>The right to access:</b> You have
                                            the right to request Rostlab for
                                            copies of your personal data. We may
                                            charge you a small fee for this
                                            service.
                                            <br />
                                            <br />
                                            <b>
                                                The right to rectification:
                                            </b>{" "}
                                            You have the right to request that
                                            Rostlab correct any information you
                                            believe is inaccurate. You also have
                                            the right to request Rostlab to
                                            complete the information you believe
                                            is incomplete.
                                            <br />
                                            <br />
                                            <b>The right to erasure</b> You have
                                            the right to request that Rostlab
                                            erase your personal data, under
                                            certain conditions.
                                            <br />
                                            <br />
                                            <b>
                                                The right to restrict
                                                processing:
                                            </b>{" "}
                                            You have the right to request that
                                            Rostlab restrict the processing of
                                            your personal data, under certain
                                            conditions.
                                            <br />
                                            <br />
                                            <b>
                                                The right to object to
                                                processing:
                                            </b>{" "}
                                            You have the right to object to
                                            Rostlab's processing of your
                                            personal data, under certain
                                            conditions.
                                            <br />
                                            <br />
                                            <b>
                                                The right to data portability:
                                            </b>{" "}
                                            You have the right to request that
                                            Rostlab transfers the data that we
                                            have collected to another
                                            organization, or directly to you,
                                            under certain conditions.
                                            <br />
                                            <br />
                                            If you make a request, we have one
                                            month to respond to you. If you
                                            would like to exercise any of these
                                            rights, please contact us at our
                                            email: gdpr \at\ rostlab.org
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            What are cookies?
                                        </h2>
                                        <p className="ms-3">
                                            Cookies are text files placed on
                                            your computer to collect standard
                                            Internet log information and visitor
                                            behavior information. When you visit
                                            our websites, we may collect
                                            information from you automatically
                                            through cookies or similar
                                            technology. <br />
                                            For further information, visit{" "}
                                            <a
                                                href="https:www.allaboutcookies.org"
                                                className="link-dark"
                                            >
                                                {" "}
                                                allaboutcookies.org
                                            </a>
                                            .
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How do we use cookies?
                                        </h2>
                                        <p className="ms-3">
                                            Rostlab uses cookies in a range of
                                            ways to improve your experience on
                                            our website, including:
                                        </p>
                                        <ul className="ms-3">
                                            <li>
                                                Understanding how you use our
                                                website
                                            </li>
                                            <li>
                                                Saving input and navigation
                                                states
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            What types of cookies do we use?
                                        </h2>
                                        <p className="ms-3">
                                            There are a number of different
                                            types of cookies, however, our
                                            website uses:
                                            <br /> <br />
                                            <b>Functional Cookies:</b> Rostlab
                                            uses these cookies so that we
                                            recognize you on our website and
                                            remember previous input.
                                            <br />
                                            <br />
                                            <b>Analytical Cookies:</b> Rostlab
                                            uses these cookies to collect
                                            information about how you use our
                                            service, the content you viewed, the
                                            links you followed and information
                                            about your browser, device, and your
                                            IP address. Rostlab will never share
                                            these information with anyone.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How to manage cookies{" "}
                                        </h2>
                                        <p className="ms-3">
                                            You can set your browser not to
                                            accept cookies, and{" "}
                                            <a
                                                href="https:www.allaboutcookies.org"
                                                className="link-dark"
                                            >
                                                the above website
                                            </a>{" "}
                                            tells you how to remove cookies from
                                            your browser. However, in a few
                                            cases, some of our website features
                                            may not function as a result.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            Privacy policies of other websites
                                        </h2>
                                        <p className="ms-3">
                                            This service links to other websites
                                            and uses external services. Our
                                            privacy policy applies only to our
                                            website, so if you click on a link
                                            to another website, you should
                                            familiraize yourself with their
                                            privacy policy.
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How to contact us
                                        </h2>
                                        <p className="ms-3">
                                            If you have any questions about
                                            Rostlab's privacy policy, the data
                                            we hold on you, or you would like to
                                            exercise one of your data protection
                                            rights, please do not hesitate to
                                            contact us via:
                                        </p>
                                        <p className="imprint-adress ms-3">
                                            <b>e-mail:</b> gdpr \at\ rostlab.org
                                            <br />
                                            <b>post:</b> I12 - Department for
                                            Bioinformatics and Computational
                                            Biology <br />
                                            School of Computation, Information
                                            and Technology <br />
                                            Boltzmannstraße 3 <br />
                                            85748 Garching <br />
                                            Germany
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mb-3">
                                            How to contact the appropriate
                                            authority
                                        </h2>
                                        <p className="ms-3">
                                            Should you wish to report a
                                            complaint or if you feel that
                                            Rostlab has not addressed your
                                            concern in a satisfactory manner,
                                            you may contact the bavarian data
                                            protection commissioner, whom you
                                            can reach using:
                                        </p>
                                        <p className="imprint-adress ms-3">
                                            <b>phone:</b> 089 212672-0 <br />
                                            <b>e-mail:</b>{" "}
                                            poststelle@datenschutz-bayern.de
                                            <br />
                                            <b>more information:</b>{" "}
                                            <a
                                                href="https://www.datenschutz-bayern.de/"
                                                className="link-dark"
                                            >
                                                https://www.datenschutz-bayern.de/
                                            </a>
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="mt-5 mb-3">
                                            Specific Information about this
                                            website
                                        </h2>
                                        <h3 className="mb-1">
                                            Website Log Files
                                        </h3>
                                        <p className="ms-3">
                                            When you visit our websites, your
                                            browser transmits certain data to
                                            our web server for technical
                                            reasons. The following data are
                                            recorded during an ongoing
                                            connection for communication between
                                            your internet browser and our web
                                            server:
                                        </p>
                                        <ul className="ms-3">
                                            <li>
                                                The data you entered into the
                                                input field
                                            </li>
                                            <li>
                                                Date and time of your request
                                            </li>

                                            <li>Name of the requested file</li>

                                            <li>
                                                Page from which the file was
                                                requested
                                            </li>

                                            <li>
                                                Access status (file transferred,
                                                file not found, etc.)
                                            </li>

                                            <li>
                                                Type and version of the browser
                                                and the operating system you use
                                            </li>

                                            <li>
                                                Full IP address of the
                                                requesting computer
                                            </li>

                                            <li>
                                                Quantity of data transferred
                                            </li>
                                        </ul>
                                        <p className="ms-3">
                                            For reasons of technical security,
                                            in particular to prevent attacks on
                                            our web server, we store these data
                                            for a short period of time. User
                                            input is stored for up to one month
                                            to provide a faster service (due to
                                            caching) and alleviate resource
                                            strain. It is impossible to discern
                                            the identity of individual persons
                                            based on this data. After seven days
                                            at the latest, the data is
                                            anonymized by shortening the IP
                                            address at the domain level, so that
                                            it is no longer possible to
                                            establish any reference to the
                                            individual user. The anonymized data
                                            will also be processed for
                                            statistical purposes. We don't
                                            compare any data to data in other
                                            databases or forward them to third
                                            parties, even in excerpts.
                                        </p>
                                        <h3 className="my-2">
                                            Website analysis by Matomo
                                        </h3>
                                        We use Matomo, a web analysis service,
                                        to optimally design our website. To
                                        evaluate and analyze the use of our
                                        website, usage information is
                                        transmitted to our servers and stored
                                        for analysis. Your IP address will be
                                        shortened during this process and thus
                                        anonymized. If you want to prevent your
                                        data from being processed for data
                                        analysis purposes, you can object at any
                                        time{" "}
                                        <Button
                                            onClick={() => disableTracking()}
                                            variant="link"
                                            className="link-dark mx-0 px-0"
                                        >
                                            with a mouse click
                                        </Button>
                                        . In this case, an opt-out cookie that
                                        does not contain any usage data is
                                        stored in your browser. As a result,
                                        Matomo will not collect any data from
                                        your current visit to our website.
                                        Please note: If you delete cookies, this
                                        will also delete the opt-out cookie,
                                        which you may need to reactivate.
                                    </div>
                                </Stack>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item>
                            <Accordion.Header>
                                Terms of Service
                            </Accordion.Header>
                            <Accordion.Body>
                                Content in Preparation ...
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
};

export default Legal;
