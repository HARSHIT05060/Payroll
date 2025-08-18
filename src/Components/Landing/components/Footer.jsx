import { Separator } from "../ui/separator";

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/50">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">H</span>
                            </div>
                            <span className="text-2xl font-bold text-foreground">Hurevo</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Empowering businesses with intelligent HR solutions.
                            Streamline operations, engage employees, and drive growth.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Product</h3>
                        <div className="space-y-2">
                            <a href="#"
                                className="block text-muted-foreground hover:text-primary transition-colors">Features</a>
                            <a href="#"
                                className="block text-muted-foreground hover:text-primary transition-colors">Integrations</a>
                            <a href="#"
                                className="block text-muted-foreground hover:text-primary transition-colors">Security</a>
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">API</a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Company</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">About</a>
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Careers</a>
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Press</a>
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Contact</a>
                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Support</h3>
                        <div className="space-y-2">
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Help
                                Center</a>
                            <a href="#"
                                className="block text-muted-foreground hover:text-primary transition-colors">Documentation</a>
                            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Status</a>
                            <a href="#"
                                className="block text-muted-foreground hover:text-primary transition-colors">Community</a>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-muted-foreground text-sm">
                        © 2024 Hurevo. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;