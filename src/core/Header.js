import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {logout, isAuthenticated} from '../auth';
import {DefaultProfile, Logo} from '../img';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faHome,
    faSignInAlt,
    faSignOutAlt,
    faUserPlus,
    faUsers,
    faUserEdit,
    faCalendarCheck,
    faClipboardList,
    faUserCog, faCog, faPlus, faTags
} from '@fortawesome/free-solid-svg-icons'
import {
    Heading,
    Image,
    Text,
    Box,
    Flex,
    MenuItem,
    MenuList,
    MenuButton,
    Button,
    Menu
} from "@chakra-ui/core";

const isActive = (history, paths) => {
    let style;
    paths.map(p => {
        if (history.location.pathname === p)
            style = {color: '#C70039'};
    });
    return style || {color: '#555555'};
};

const MenuItems = ({children}) => (
    <Text mt={{base: 4, md: 0}} mr={6} display="block">
        {children}
    </Text>
);

const Header = props => {
    const [show, setShow] = React.useState(false);
    const handleToggle = () => setShow(!show);
    const {history} = props;

    return (<>
            <Flex
                align="center"
                padding="1.5rem"
                bg="bg-transparent"
                color="black"
                {...props}
                className="shadow"
            >
                <Flex align="center" mr={5}>
                    <Image
                        rounded="full"
                        size="70px"
                        src={Logo}
                        alt={`RIS`}
                        fallbackSrc={DefaultProfile}
                    />
                    <Heading as="h2" size="lg" letterSpacing={"-.1rem"}
                             className="font-weight-light ml-3 d-none d-sm-block d-md-inline d-lg-inline">
                        Rede de Inclusão Social
                    </Heading>
                </Flex>

                <Box display={{base: "block", md: "none"}} onClick={handleToggle}>
                    <svg
                        fill="black"
                        width="20px"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                    </svg>
                </Box>

                <Box
                    display={{sm: show ? "block" : "none", md: "flex"}}
                    width={{sm: "full", md: "auto"}}
                    alignItems="center"
                    justifyContent='flex-end'
                    flexGrow={1}>
                    <MenuItems>
                        <Link className="nav-link" style={isActive(history, ['/'])} to="/">
                            <FontAwesomeIcon icon={faHome}/> Início
                        </Link>
                    </MenuItems>
                    {!isAuthenticated() && (
                        <>
                            <MenuItems>
                                <Link to={`/login`} style={isActive(history, [`/login`])} className="nav-link">
                                    <FontAwesomeIcon icon={faSignInAlt}/> Login
                                </Link>
                            </MenuItems>
                            <MenuItems>
                                <Link to={`/signup`} style={isActive(history, [`/signup`])} className="nav-link">
                                    <FontAwesomeIcon icon={faUserPlus}/> Cadastro
                                </Link>
                            </MenuItems>
                        </>
                    )}
                    {isAuthenticated() && (
                        <>
                            <MenuItems>
                                <Link to={`/users`}
                                      className="nav-link"
                                      style={isActive(history, [`/users`])}>
                                    <FontAwesomeIcon icon={faUsers}/> Usuários
                                </Link>
                            </MenuItems>
                            {isAuthenticated().user.isAdmin ?
                            (<Menu>
                                <MenuButton as={Button} rightIcon="chevron-down"
                                            className="bg-transparent custom-button"
                                            style={isActive(history,
                                                [`/posts`,
                                                    `/posts/create`])}>
                                        <FontAwesomeIcon icon={faCalendarCheck} className="mr-1"/> Eventos
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>
                                        <Link to={`/posts`}
                                              className="nav-link"
                                              style={isActive(history, [`/posts`])}>
                                            <FontAwesomeIcon icon={faCalendarCheck}/> Eventos
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to={`/posts/create`}
                                              className="nav-link"
                                              style={isActive(history, [`/posts/create`])}>
                                            <FontAwesomeIcon icon={faPlus} className="mr-1"/> Criar evento
                                        </Link>
                                    </MenuItem>
                                </MenuList>
                            </Menu>) :
                            (<MenuItems>
                                <Link to={`/posts`}
                                      className="nav-link"
                                      style={isActive(history, [`/posts`])}>
                                    <FontAwesomeIcon icon={faCalendarCheck}/> Eventos
                                </Link>
                            </MenuItems>)
                                }
                            <MenuItems>
                                <Link to={`/tags`}
                                      className="nav-link"
                                      style={isActive(history, [`/tags`])}>
                                    <FontAwesomeIcon icon={faTags}/> Categorias
                                </Link>
                            </MenuItems>
                            <Menu>
                                <MenuButton as={Button} rightIcon="chevron-down"
                                            className="bg-transparent custom-button"
                                            style={isActive(history,
                                                [`/user/edit/${isAuthenticated().user._id}`,
                                                    `/schedule/${isAuthenticated().user._id}`,
                                                    `/user/manage/${isAuthenticated().user._id}`])}>
                                    < FontAwesomeIcon icon={faUserCog} className="mr-1"/>
                                    Perfil
                                </MenuButton>
                                <MenuList>
                                    <MenuItem>
                                        <Link to={`/user/edit/${isAuthenticated().user._id}`}
                                              className="nav-link"
                                              style={isActive(history, [`/user/edit/${isAuthenticated().user._id}`])}>
                                            <FontAwesomeIcon icon={faUserEdit}/> Meu perfil
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to={`/schedule/${isAuthenticated().user._id}`}
                                              className="nav-link"
                                              style={isActive(history, [`/schedule/${isAuthenticated().user._id}`])}>
                                            <FontAwesomeIcon icon={faClipboardList}/> Minha agenda
                                        </Link>
                                    </MenuItem>
                                    {isAuthenticated() && isAuthenticated().user.isAdmin && (
                                        <MenuItems>
                                            <Link to={`/user/manage/${isAuthenticated().user._id}`}
                                                  className="nav-link"
                                                  style={isActive(history, [`/user/manage/${isAuthenticated().user._id}`])}>
                                                <FontAwesomeIcon icon={faCog}/> Administradores
                                            </Link>
                                        </MenuItems>
                                    )}
                                </MenuList>
                            </Menu>
                            <MenuItems>
                                <Button onClick={() => logout(() => {
                                    history.push('/');
                                })} style={isActive(history, [`/logout`])}
                                        className="nav-link bg-transparent">
                                    <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                                </Button>
                            </MenuItems>
                        </>
                    )}
                </Box>
            </Flex>
        </>
    );
};

export default withRouter(Header);