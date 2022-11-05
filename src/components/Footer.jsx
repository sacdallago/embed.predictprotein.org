import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaGithub, FaGlobe } from "react-icons/fa";

import LogoSq from "../assets/logo_sq_light.svg";

const Footer = () => (
    <footer className="page-footer bg-light font-small pt-4 mt-md-5">
        <Container>
            <Row className="justify-content-center">
                <Col
                    md={2}
                    xs={12}
                    className="mt-md-0 mt-3 me-md-5 mb-4 mb-md-0 text-center"
                >
                    <a href="https://rostlab.org">
                        <img
                            src={LogoSq}
                            className="img-fluid w-75"
                            alt="Rostlab Logo"
                        />
                    </a>
                </Col>

                <Col xs md={2} className="mb-md-0 mb-3 text-start">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                        <li>
                            <Link to="imprint" className="link-dark">
                                Impressum
                            </Link>
                        </li>
                        <li>
                            <Link to="legal" className="link-dark">
                                ToS & Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://github.com/sacdallago/embed.predictprotein.org"
                                className="link-dark"
                            >
                                Contribute
                            </a>
                        </li>
                        <li>
                            <Link to="cite" className="link-dark">
                                Cite
                            </Link>
                        </li>
                    </ul>
                </Col>

                <Col xs md={2} className="mb-md-0 mb-3 text-start">
                    <h5 className="text-uppercase">Services</h5>
                    <ul className="list-unstyled">
                        <li>
                            <Link to="glossary" className="link-dark">
                                Gloassary
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://github.com/sokrypton/ColabFold"
                                className="link-dark"
                            >
                                Colab Fold
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://alphafold.ebi.ac.uk/"
                                className="link-dark"
                            >
                                AlphaFold2 DB
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.uniprot.org/"
                                className="link-dark"
                            >
                                UniprotKB
                            </a>
                        </li>
                    </ul>
                </Col>

                <Col xs md={3} xl={2} className="mb-md-0 mb-3 ">
                    <h5 className="text-uppercase">Follow Us</h5>

                    <a href="https://twitter.com/rostlab" className="link-dark">
                        <FaTwitter size="2em" className="m-1" />
                    </a>
                    <a
                        href="https://www.youtube.com/rostlab"
                        className="link-dark"
                    >
                        <FaYoutube size="2em" className="m-1" />
                    </a>
                    <a href="https://github.com/Rostlab" className="link-dark">
                        <FaGithub size="2em" className="m-1" />
                    </a>
                    <a href="https://rostlab.org" className="link-dark">
                        <FaGlobe size="2em" className="m-1" />
                    </a>
                </Col>
            </Row>
        </Container>

        <div className="footer-copyright text-center py-3">
            © 2022 Copyright:{" "}
            <a href="https://rostlab.org" className="text-dark">
                Rostlab
            </a>
        </div>
    </footer>
);

export default Footer;
