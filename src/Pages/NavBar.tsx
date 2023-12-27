import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton
} from '@chakra-ui/react'
import { HamburgerIcon, } from '@chakra-ui/icons'
import { IoHome } from "react-icons/io5";
import { FaCartShopping, FaCircleInfo } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaStore } from "react-icons/fa";
export default function NavBar() {
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                paddingTop: '25px',
                marginRight: '20px'
            }}>
                <Menu placement="right-start">
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<HamburgerIcon />}
                        variant="outline"
                    />
                    <MenuList>
                        <Link to="/">
                            <MenuItem icon={<IoHome />} >
                                Home
                            </MenuItem>
                        </Link>
                        <Link to="/product">
                            <MenuItem icon={<FaStore />} >
                                Product
                            </MenuItem>
                        </Link>
                        <Link to="/cart">
                            <MenuItem icon={<FaCartShopping />} >
                                Cart
                            </MenuItem></Link>
                        <a href="https://github.com/ViNu-23/" target="_blank" rel="noopener noreferrer">
                            <MenuItem icon={<FaCircleInfo />} >
                                About Me
                            </MenuItem>
                        </a>

                    </MenuList>
                </Menu>
            </div>

        </>
    )
}

