import React from "react";
import {BeMyEyes, GuiaRodas, HandTalk, One, Three, Two, VLibras, Ecuador, Libras} from "../img";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowUp, faPlus, faEnvelopeOpen} from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import Header from "./Header";
import {
    Button,
    Heading,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/core";

const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <header className="masthead background">
                <Header/>
                <div className="container h-100">
                    <div className="row h-75 align-items-center">
                        <div className="col-12 text-center">
                            <Heading as="h3" className="font-weight-light">
                                Compartilhando acessibilidade
                                <br/>Promovendo inclusão
                            </Heading>
                            <Link to={'/login'}>
                                <button type="button" className="btn btn-default pr-xl-5 pl-xl-5 m-3">Login</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="fab-top">
                <a href="/" className="main text-center text-white">
                    <FontAwesomeIcon icon={faArrowUp}/>
                </a>
            </div>

            <section className="container py-5" id="project">
                <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>Descrição em Libras</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody className='center'>
                            <iFrame width="560" height="315" src="https://www.youtube.com/embed/ZG6BKjygNTI?start=13"
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen>
                            </iFrame>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <Heading as="h3" className="font-weight-light m-3">
                    <Button onClick={onOpen} colorScheme="teal" variant="ghost" className='p-1 mr-1'>
                        <img src={Libras} alt="Conteúdo acessível em Libras"
                             width="40" height="40"/>
                    </Button>
                    O projeto
                </Heading>
                <p className="m-3"> A ferramenta RIS, Rede de Inclusão Social é resultado do trabalho de conclusão de
                    curso
                    desenvolvido pela aluna Ana Luiza Moraes orientado pela Prof. Dr. Dayanne Coelho da Universidade
                    Federal de Ouro Preto. A ferramenta auxilia pessoas surdas a encontrar locais e eventos de
                    diversas áreas que prezam pela acessibilidade. </p>
                <div className="row m-3">
                    <div className="col-lg-4">
                        <img className="rounded-circle center" src={One} alt="Passo 1" width="70" height="70"/>
                        <Text><Link to={'/signup'}> Se cadastre</Link> no site e tenha acesso à diversos eventos
                            acessíveis à comunidade surda, além de eventos relacionados à surdez e acessibilidade. Caso
                            já tenha
                            cadastro, acesse o site por <Link to={'/login'}>aqui.</Link>
                        </Text>
                    </div>

                    <div className="col-lg-4">
                        <img className="rounded-circle center"
                             src={Two} alt="Passo 2" width="70" height="70"/>
                        <p>
                            Procure por eventos utilizando filtros de localização e categoria. Interaja com
                            outros usuários e colabore comentando e avaliando a acessibilidade dos eventos que gostar.
                        </p>
                    </div>

                    <div className="col-lg-4">
                        <img className="rounded-circle center"
                             src={Three} alt="Passo 3" width="70" height="70"/>
                        <p>
                            Crie seus próprios eventos acessíveis e colabore com a inclusão social de pessoas surdas.
                        </p>
                    </div>
                </div>
            </section>

            <hr/>

            <section className="py-5 container" id="divulgation">
                <Heading as="h3" className="font-weight-light m-3">
                    <Button onClick={onOpen} colorScheme="teal" variant="ghost" className='p-1 mr-1'>
                        <img src={Libras} alt="Conteúdo acessível em Libras"
                             width="40" height="40"/>
                    </Button>
                    Mural de divulgação </Heading>
                <p> Veja alguns dos projetos e ferramentas que colaboram e fortalecem à inclusão social ao redor do
                    mundo: </p>
                <div className="card-columns">
                    <div className="card col">
                        <img className="card-img-top" src={HandTalk}
                             alt="Hand Talk"/>
                        <div className="card-body">
                            <Heading as="h4" className="card-title font-weight-light">Hand Talk</Heading>
                            <p className="card-text">
                                <strong>Hand Talk</strong> é uma plataforma que traduz simultaneamente conteúdos em
                                português para a
                                LIBRAS e tem como objetivo a inclusão social de pessoas surdas.
                            </p>
                            <p className="card-text">
                                <i className="fas fa-plus"/>
                                <a target="_blank" rel="noopener noreferrer" className="text-muted"
                                   href="https://www.handtalk.me/br">
                                    <FontAwesomeIcon icon={faPlus}/> Saiba mais
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="card col">
                        <img className="card-img-top" src={GuiaRodas}
                             alt="Guia de Rodas"/>
                        <div className="card-body">
                            <Heading as="h4" className="card-title font-weight-light">Guia de Rodas</Heading>
                            <p className="card-text">
                                Através do aplicativo <strong>Guia de Rodas</strong>, qualquer pessoa, com deficiência
                                ou não, pode avaliar
                                a acessibilidade dos locais que visitam, para que essas informações estejam disponíveis
                                para toda a
                                sociedade.
                            </p>
                            <p className="card-text">
                                <i className="fas fa-plus"/>
                                <a target="_blank" rel="noopener noreferrer" className="text-muted"
                                   href="https://guiaderodas.com/">
                                    <FontAwesomeIcon icon={faPlus}/> Saiba mais
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="card col">
                        <img className="card-img-top" src={VLibras}
                             alt="VLibras"/>
                        <div className="card-body">
                            <Heading as="h4" className="card-title font-weight-light">VLibras</Heading>
                            <p className="card-text">
                                O <strong>VLibras</strong> é um aplicativo que faz parte de um conjunto de ferramentas
                                que buscam
                                ajudar os surdos em suas atividades diárias. Ele visa ajudar na comunicação e na
                                disseminação
                                e padronização da LIBRAS.
                            </p>
                            <p className="card-text">
                                <i className="fas fa-plus"/>
                                <a target="_blank" rel="noopener noreferrer" className="text-muted"
                                   href="https://www.vlibras.gov.br/">
                                    <FontAwesomeIcon icon={faPlus}/> Saiba mais
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="card col">
                        <img className="card-img-top" src={BeMyEyes}
                             alt="Be my eyes" width="100%"/>
                        <div className="card-body">
                            <Heading as="h4" className="card-title font-weight-light">Be my eyes</Heading>
                            <p className="card-text">
                                O <strong>Be My Eyes</strong> é composto por uma comunidade global de pessoas cegas ou
                                com visão
                                limitada em conjunto com voluntários sem deficiência visual. Ele captura o poder da
                                tecnologia e
                                a conexão humana para levar a visão para pessoas que perderam esse sentido.
                            </p>
                            <p className="card-text">
                                <i className="fas fa-plus"/>
                                <a target="_blank" rel="noopener noreferrer" className="text-muted"
                                   href="https://www.bemyeyes.com/language/portuguese-brazil">
                                    <FontAwesomeIcon icon={faPlus}/> Saiba mais
                                </a>
                            </p>
                        </div>
                    </div>
                    <div className="card col">
                        <img className="card-img-top" src={Ecuador}
                             alt="Mujer, cuerpo y salud" width="100%"/>
                        <div className="card-body">
                            <Heading as="h4" className="card-title font-weight-light">Mujer, cuerpo y salud</Heading>
                            <p className="card-text">
                                <strong>Mujer, cuerpo y salud</strong> é uma rede social na qual mulheres
                                surdas do Equador têm acesso à informações sobre Saúde Sexual e Reprodutiva. O trabalho
                                reforça a falta de recursos relacionados ao desenvolvimento pessoal de mulheres surdas e
                                a
                                indisponibilidade dessas informações. O trabalho de pesquisa para o
                                desenvolvimento da ferramenta e seu processo de validação podem ser encontrados{' '}
                                <a target="_blank" rel="noopener noreferrer"
                                   href="https://www.researchgate.net/profile/Yaroslava_Robles_Bykbaev/publication/336624244_A_Bespoke_Social_Network_for_Deaf_Women_in_Ecuador_to_Access_Information_on_Sexual_and_Reproductive_Health/links/5dad1317299bf111d4bf6217/A-Bespoke-Social-Network-for-Deaf-Women-in-Ecuador-to-Access-Information-on-Sexual-and-Reproductive-Health.pdf">
                                    aqui </a>.
                            </p>
                            <p className="card-text">
                                <i className="fas fa-plus"/>
                                <a target="_blank" className="text-muted" rel="noopener noreferrer"
                                   href="http://mesade.org/mcs/">
                                    <FontAwesomeIcon icon={faPlus}/> Saiba mais
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr/>

            <section className="py-5 container" id="contact">
                <Heading as="h3" className="font-weight-light"> Contato </Heading><br/>
                <div className="row">
                        <span className="col-sm">
                            <FontAwesomeIcon icon={faFacebookF}/>
                            <a target="_blank" rel="noopener noreferrer"
                               href="https://facebook.com/ana96moraes"> facebook.com/ana96moraes </a>
                        </span>
                    <span className="col-sm">
                            <FontAwesomeIcon icon={faEnvelopeOpen}/> ana96moraes@gmail.com
                        </span>
                    <span className="col-sm">
                            <FontAwesomeIcon icon={faWhatsapp}/> (31) 98897-9376
                        </span>
                </div>
            </section>
        </>
    );
};

export default Home;