import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaGithub, FaGlobe } from "react-icons/fa";

import LogoSq from "../assets/logo_sq_light.svg";

const Footer = () => (
    <footer className="page-footer bg-light font-small pt-4 mt-md-5">
        <div className="container-fluid text-start">
            <div className="row justify-content-center">
                <div className="col-md-2 col-12 mt-md-0 mt-3 me-md-5 mb-4 mb-md-0 text-center">
                    <a href="https://rostlab.org">
                        <img
                            src={LogoSq}
                            className="img-fluid w-75"
                            alt="Rostlab Logo"
                        />
                    </a>
                </div>

                <div className="col-auto col-md-2 mb-md-0 mb-3 text-start">
                    <h5 className="text-uppercase">Links</h5>
                    <ul className="list-unstyled">
                        <li>
                            <Link to="imprint" className="link-dark">
                                Imprint
                            </Link>
                        </li>
                        <li>
                            <Link to="" className="link-dark">
                                ToS & Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <a
                                href="https://github.com/sacdallago/embed.predictprotein.org"
                                target="_blank"
                                rel="noreferrer"
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
                </div>

                <div className="col-auto col-md-2 mb-md-0 mb-3 text-start">
                    <h5 className="text-uppercase">Services</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="#!" className="link-dark">
                                Gloassary
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="link-dark">
                                Colab Fold
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="link-dark">
                                AlphaFold2 DB
                            </a>
                        </li>
                        <li>
                            <a href="#!" className="link-dark">
                                UniprotKB
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="col-auto col-md-3 mb-md-0 mb-3 ">
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
                </div>
            </div>
        </div>

        <div className="footer-copyright text-center py-3">
            © 2022 Copyright:{" "}
            <a href="https://rostlab.org" className="text-dark">
                Rostlab
            </a>
        </div>
    </footer>
);

export default Footer;
