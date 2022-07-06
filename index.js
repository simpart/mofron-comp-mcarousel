const Circle  = require('mofron-comp-circle');
const SyncWin = require('mofron-effect-syncwin');
const HrzPos  = require('mofron-effect-hrzpos');
const Color   = require('mofron-effect-color');
const Flick      = require('mofron-event-flick');
const Swipe      = require('mofron-event-dev');
const TouchStart = require('mofron-event-touchstart');
const loMargin = require('mofron-layout-margin');
const comutl  = mofron.util.common;
const ConfArg = mofron.class.ConfArg;

/**
 * @file mofron-comp-mcarousel/index.js
 * @brief mobile carousel component for mofron
 * @license MIT
 */
module.exports = class extends mofron.class.Component {
    /**
     * initialize component
     * 
     * @param (mixed) 
     *                key-value: component config
     * @type private
     */
    constructor (p1) {
        try {
            super();
            this.modname("MCarousel");
            
	    /* init config */
            this.confmng().add('current_page', { type: 'number', init: 0 });
            this.confmng().add('curxpos', { type: 'number', init: 0 });
            
	    if (0 < arguments.length) {
                this.config(p1);
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     * 
     * @type private
     */
    initDomConts () {
        try {
            super.initDomConts();
            super.child([this.cardArea(), this.pagingArea()]);
            this.childDom(this.cardArea().childDom());
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }

    cardArea (prm) {
        try {
	    if (comutl.isinc(prm, "Component")) {
	        let touch_start = (t1,t2,t3) => {
                    try {
                        t3.data('right_buff', parseInt(t3.cardArea().child()[0].style('right')));
		    } catch (e) {
                        console.error(e.stack);
                        throw e;
		    }
		};
                prm.config({
		    style: {
                        "display": "flex",
		        "overflow": "hidden"
		    },
                    effect: new SyncWin(),
                    event: [
                        new Flick(new ConfArg(this.flickEvent, this)),
                        new Swipe(new ConfArg(this.swipeEvent, { comp: this, type: 'swipe' })),
			new TouchStart(new ConfArg(touch_start, this))
                    ]
		});
	    }
            return this.innerComp('cardArea', prm, mofron.class.Component);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    pagingArea (prm) {
        try {
	    if (comutl.isinc(prm, "Component")) {
                prm.config({
                    style: {
		        'display':  'flex',
		        'position': 'fixed',
			'top': (window.innerHeight - (window.innerHeight*0.1))  + 'px'
                    },
		    effect: new HrzPos(),
		});
	    }
            return this.innerComp('pagingArea', prm, mofron.class.Component);
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    swipeEvent (p1,p2,p3) {
        try {
	    let cards      = p3.comp.cardArea().child();
	    let right_buff = p3.comp.data('right_buff');
            
	    if ('move' === p2.type) {
                for (let cidx in cards) {
                    cards[cidx].style({ 'right': right_buff + p2.diffX + 'px' });
                }
                p3.comp.data('last_diff_x', p2.diffX);
	    } else {
                let last_diff_x = p3.comp.data('last_diff_x');
                if (Math.abs(last_diff_x) > (window.innerWidth * 0.3)) {
		    let upd_page = null;
                    if (0 < last_diff_x) {
                        upd_page = p3.comp.current_page()+1;
		    } else {
                        upd_page = p3.comp.current_page()-1;
		    }

                    if (false !== p3.comp.slide(upd_page, p3.comp)) {
                        p3.comp.confmng('current_page', upd_page);
		    } else {
                        p3.comp.slide(p3.comp.current_page(), p3.comp);
		    }
		} else {
                    p3.comp.slide(p3.comp.current_page(), p3.comp);
		}
	    }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    flickEvent (p1,p2,p3) {
        try {
	    if ("left" === p2) {
                if (false !== p3.slide(p3.current_page()+1, p3)) {
                    p3.confmng('current_page', p3.current_page()+1);
                } else {
                    p3.slide(p3.current_page(),p3);
		}
            } else if ("right" === p2) {
                if (false !== p3.slide(p3.current_page()-1, p3)) {
                    p3.confmng('current_page', p3.current_page()-1);
		} else {
                    p3.slide(0,p3);
		}
            } else {
                return;
            }
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }
    
    current_page () {
        try {
            return this.confmng('current_page');
	} catch (e) {
            console.error(e.stack);
            throw e;
	}
    }

    slide (pg_idx, comp) {
        try {
	    if ((pg_idx < 0) || (comp.cardArea().child().length-1 < pg_idx)) {
                return false;
	    }
            
            let end_pos = window.innerWidth * pg_idx;
            let cards   = comp.cardArea().child();
            
            for (let cidx in cards) {
                cards[cidx].style({
                    'transition': 'right 300ms 0s ease',
                    'right': end_pos + 'px'
                });
		comp.pagingArea().child()[cidx].child()[0].execEffect(2);
            }
	    comp.pagingArea().child()[pg_idx].child()[0].execEffect(3);
            
            setTimeout(() => {
                for (let cidx in cards) {
                    cards[cidx].style({ 'transition': null });
                }
            },300);
	} catch (e) {
	    console.error(e.stack);
            throw e;
	}
    }

    child (prm, idx) {
        try {
	    if (undefined !== prm) {
                if (true === Array.isArray(prm)) {
                    for (let c_idx in prm) {
                        this.child(prm[c_idx]);
		    }
		} else {
                    prm.config({
		        effect: new SyncWin(),
		        style: { 'flex-shrink':'0', 'right': '0px', 'position': 'relative' }
                    });
		    super.child(prm);
                    let pg_idx = new mofron.class.Component({
                                     width: '0.2rem',
			             child: new Circle({
                                         size:   new ConfArg('0.1rem', '0.1rem'),
                                         effect: [
				             new HrzPos(),
				             new Color({ eid:2, color: [180,180,180], speed: 300, transition: "background" }),
				             new Color({ eid:3, color: [255,255,255], speed: 300, transition: "background" })
				         ]
                                     })
		                 });
		    if (0 === this.pagingArea().child().length) {
                        pg_idx.child()[0].baseColor([255,255,255]);
		    } else {
                        pg_idx.child()[0].baseColor([180,180,180]);
		    }
		    this.pagingArea().child(pg_idx);
		}
		return;
	    }
	    return super.child();
	} catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
/* end of file */
