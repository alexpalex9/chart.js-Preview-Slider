// line with point, could be interesting for event
//https://jsfiddle.net/w6zs07xx/

Chart.plugins.register({
    beforeDatasetsDraw: function(chartInstance) {
		// Before the datasets are drawn but after scales are drawn
		var ctx = chartInstance.chart.ctx;
		var chartArea = chartInstance.chartArea;
		ctx.save();
		ctx.beginPath();
		ctx.rect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
		ctx.clip();
    },
    afterDatasetsDraw: function(chartInstance) {
        chartInstance.chart.ctx.restore();
    },
});
/**
function findIndex(c,v){
	// console.log('findIndex',v)
	if (c.options.scales.xAxes[0].type=="time"){
		// console.log('findIndex TIME',c.data.labels)
		for (var i in c.data.labels){
			// console.log(c.data.labels[i],v);
			if (c.data.labels[i]>=v){
				// console.log(i)
				return Number(i);
				
			}
		}		
	}else{
		for (var i in c.data.labels){
			if (c.data.labels[i]==v){
				return i
			}
		}
	}
	return null
}**/
/*** PLUGIN MANAGEING ZOOM ***/
// Chart.plugins.register({
    // afterDraw: function(_this) {	
		// if (_this.slider && _this.updateFromSlider!=true){	
			// if (_this.config.options.scales.xAxes[0].type=="time"){
				// if ( _this.config.options.scales.xAxes[0].time.min && _this.config.options.scales.xAxes[0].time.max){
				// var newSet=[
					// _this.config.options.scales.xAxes[0].time.min,
					// _this.config.options.scales.xAxes[0].time.max ]
					// console.log(_this.slider.noUiSlider.get(), newSet,_this.configPreview.options.scales.xAxes[0].time);
					// _this.slider.noUiSlider.set(newSet);  
				// };
			// }else{
				// if ( _this.config.options.scales.xAxes[0].ticks.min && _this.config.options.scales.xAxes[0].ticks.max){
					// var newSet=[
						// findIndex(_this.config,_this.config.options.scales.xAxes[0].ticks.min),
						// findIndex(_this.config,_this.config.options.scales.xAxes[0].ticks.max) ]
					// _this.slider.noUiSlider.set(newSet);  
				// };
			// };
		// };
    // }
// });

/*** PLUGIN MANAGEING SLIDER ***/
Chart.plugins.register({
	afterInit: function(_this) {
		
		_this.busy=false;
		_this.chart.parent=_this;
		// _this.configClone = $.extend(true, {}, _this.config);
		if (!_this.config.options.preview){_this.config.options.preview={}};
		if (!_this.config.options.slider){_this.config.options.slider={}};
		_this.$previewChart=$('#' + _this.config.options.preview.id);
		_this.$slider=$('#'+_this.config.options.slider.id);
		
		// _this.config.options.maintainAspectRatio=false;
		if (_this.config.options.slider.autoStart==true && _this.$slider.length>0){
			// _this.factor=Math.min($(window).width()/2000,1);
			_this.factor=Math.min($(window).width()/3/_this.config.data.labels.length,1);
		}else{
			_this.factor=1;
		};
		if (_this.config.options.scales.xAxes[0].type=="time"){
			// console.log("set min and manx",_this.config.data.labels[_this.config.data.labels.length-1])
			_this.config.options.scales.xAxes[0].time.max=_this.config.data.labels[_this.config.data.labels.length-1];
			_this.config.options.scales.xAxes[0].time.min=_this.config.data.labels[0]+((_this.config.data.labels[_this.config.data.labels.length-1]-_this.config.data.labels[0])*(1-_this.factor));
		}else{
			_this.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[Math.round((_this.config.data.labels.length-1)*(1-_this.factor))];
		};
			
		
		if (_this.$slider.length>0){
			_this.config.options.layout ={padding:{right:20}};
		}
		
		if (_this.$previewChart.length>0){
			var configPreview = $.extend(true, {}, _this.config);
			delete configPreview.options.preview;
			delete configPreview.options.slider;
			delete configPreview.options.zoom;
			delete configPreview.options.pan;
			configPreview.options.legend = {display:false};
			configPreview.options.title = {display:false};
			configPreview.options.maintainAspectRatio=false;
			// configPreview.options.tooltips.display=false;
			configPreview.options.tooltips.enabled=false;
			// configPreview.options.scales.yAxes[0].display=false;
			// configPreview.options.scales.xAxes[0].display=false;
			configPreview.options.scales.xAxes[0].ticks.minRotation=90;
			configPreview.options.scales.xAxes[0].ticks.maxRotation=90;
			configPreview.options.scales.xAxes[0].ticks.fontColor = 'rgba(0,0,0,0)';
			// configPreview.options.scales.yAxes[0].ticks.max=20;
			if (configPreview.options.scales.xAxes[0].type=="time"){
				
				configPreview.options.scales.xAxes[0].time.max=configPreview.data.labels[configPreview.data.labels.length-1];
				configPreview.options.scales.xAxes[0].time.min=configPreview.data.labels[0];
			};
			// if(!_this.ctxPre){
				_this.$previewChart.attr('height',100);
				// _this.$previewChart.css('height','100');
				// console.log('width',_this.chart.width)
				_this.$previewChart.attr('width',_this.chart.width);
				_this.$previewChart.css('postion','relative');
				_this.$previewChart.css('top','-50px');
				var ctxPre = document.getElementById(_this.config.options.preview.id).getContext("2d");
			// };			
			_this.previewChart = new Chart(document.getElementById(_this.config.options.preview.id).getContext("2d"), configPreview);	
		};
		
		updateChartFromSlider = function (_this){
			// _this.updateFromSlider=true;
			// if (_this.slider){
				var V = _this.slider.noUiSlider.get();
				// console.log('applu slider',V)
				if (_this.config.options.scales.xAxes[0].type=="time"){
						
						_this.config.options.scales.xAxes[0].time.min=Math.round(V[0]);
						_this.config.options.scales.xAxes[0].time.max=Math.round(V[1]);
				}else{
						_this.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[Math.floor(V[0]+1)];
						_this.config.options.scales.xAxes[0].ticks.max=_this.config.data.labels[Math.ceil(V[1])-1];
							
				};
				// console.log(_this.config.options.scales.xAxes[0].time.max,Math.round(V[1]));
				_this.update();
			// };
			// _this.updateFromSlider=false;
		};
		// updateSlider = function(){
			
		// };
		
		if (_this.$slider.length>0){
			if (_this.$previewChart.length>0){
				_this.$slider.css('position','absolute');
			}else{
				_this.$slider.css('position','relative');
				_this.$slider.css('top','-10px');
			};
			
			// _this.config.options.layout ={padding:{right:20}};
			// console.log(_this.config.data.labels.length,$(window).width(),_this.factor);
			
			_this.slider=document.getElementById(_this.config.options.slider.id)
			if (_this.config.options.scales.xAxes[0].type=="time"){
				noUiSlider.create(_this.slider, {
					start: [Math.round(_this.config.data.labels[0]+((_this.config.data.labels[_this.config.data.labels.length-1]-_this.config.data.labels[0])*(1-_this.factor))),Math.round(_this.config.data.labels[_this.config.data.labels.length-1])],
					connect: true,
					range: {
						'min': _this.config.data.labels[0],
						'max': _this.config.data.labels[_this.config.data.labels.length-1]
					}
				});
			}
			else{
				noUiSlider.create(_this.slider, {
					start: [Math.round(( _this.config.data.labels.length-1)*(1-_this.factor)), _this.config.data.labels.length],
					connect:true,
					range: {
						'min': 0,
						'max':  _this.config.data.labels.length
					}
				});
			};
			// _this.update();
			// updateChartFromSlider();
			_this.slider.noUiSlider.on('slide', function(){
				updateChartFromSlider(_this);
			});

			var drag=false;
			var dbl=false
			$("#"+_this.config.options.canvasId).attr('unselectable','on')
			 .css({'-moz-user-select':'-moz-none',
				   '-moz-user-select':'none',
				   '-o-user-select':'none',
				   '-khtml-user-select':'none', /* you could also put this in a class */
				   '-webkit-user-select':'none',/* and add the CSS class here instead */
				   '-ms-user-select':'none',
				   'user-select':'none'
			 });
			$("#"+_this.config.options.canvasId).bind('dblclick.chart',function(e){
				if (_this.slider && e.clientX>_this.chartArea.left){
					_this.dbl={};
					_this.dbl.canvasLeft=$("#"+_this.config.options.canvasId).offset().left
					// _this.dbl.lastx=e.clientX;
					_this.dbl.startx=e.clientX-$("#"+_this.config.options.canvasId).offset().left;
					_this.dbl.ctx=_this.chart.ctx;
					_this.chart.ctx.beginPath();
					_this.chart.ctx.moveTo(e.clientX-_this.dbl.canvasLeft,_this.chartArea.top);
					_this.chart.ctx.lineTo(e.clientX-_this.dbl.canvasLeft,_this.chartArea.bottom);
					_this.chart.ctx.strokeStyle="rgb(66,66,255)";
					_this.chart.ctx.stroke();
					// _this.chart.ctx.drawLine(e.clientX,_this.chartArea.top,e.clientX,_this.chartArea.bottom)
					// console.log("save ctx for dblclick")
					_this.dbl.save = _this.chart.ctx.getImageData(0,0,_this.chartArea.right,_this.chartArea.bottom);
					
					
					_this.dbl.ctx.save();
					
					drag=false;
				};
			});
			$("#"+_this.config.options.canvasId).bind('mousedown.chart touchstart.chart',function(e){
				// console.log('mousedown');
				if (_this.slider){
					// if (typeof swiper ==='object'){
						// swiper.BlockSwipe(true);
					// };
					_this.mouseInitial=e.clientX || e.originalEvent.touches[0].pageX;
					_this.endx = e.clientX - $("#"+_this.config.options.canvasId).offset().left;
					if (_this.dbl ){
						var scale=Number(_this.slider.noUiSlider.get()[1])-Number(_this.slider.noUiSlider.get()[0]);
						if (e.clientX>_this.dbl.startx){
							var offsetLeft=Math.round((_this.dbl.startx-_this.chartArea.left)/(_this.chartArea.right-_this.chartArea.left)*scale);
							var offsetRight=Math.round((_this.endx-_this.chartArea.right)/(_this.chartArea.right-_this.chartArea.left)*scale);
						}else{
							var offsetLeft=Math.round((_this.endx-_this.chartArea.left)/(_this.chartArea.right-_this.chartArea.left)*scale);
							var offsetRight=Math.round((_this.dbl.startx-_this.chartArea.right)/(_this.chartArea.right-_this.chartArea.left)*scale);
						}
						var newSet=[
							Math.max(_this.slider.noUiSlider.options.range.min,Number(_this.slider.noUiSlider.get()[0])+offsetLeft),
							Math.min(_this.slider.noUiSlider.options.range.max,Number(_this.slider.noUiSlider.get()[1])+offsetRight)
						];
						delete _this.dbl;
						_this.slider.noUiSlider.set(newSet);
						updateChartFromSlider(_this);
						// delete _this.dbl;
					}else{
						drag=true;
					};
				};
				
			});
			$("#"+_this.config.options.canvasId).bind('mouseup.chart touchend.chart',function(e){
				if (_this.slider){
					drag=false;
					// if (typeof swiper ==='object'){
						// swiper.BlockSwipe(false);
					// };
				};

			});
			$(document).bind('keyup.chart',function(e) { 
				if (e.keyCode === 27) {
					delete _this.dbl;
					_this.draw();	
				};
			});
			$("#"+_this.config.options.canvasId).bind('mousemove.chart touchmove.chart',function(e){
				// console.log(e.clientX,_this.chartArea.left);
				if (drag==true && !_this.dbl ){
					var x = e.clientX || e.originalEvent.touches[0].pageX;
					var delta = x -_this.mouseInitial;
					var scale=Number(_this.slider.noUiSlider.get()[1])-Number(_this.slider.noUiSlider.get()[0]);
					var offset=-Math.round((delta)/(_this.chartArea.right-_this.chartArea.left)*scale);
					if (offset!=0 && offset!=-0){_this.mouseInitial = x};
					var newSet=[
						Math.max(_this.slider.noUiSlider.options.range.min,Number(_this.slider.noUiSlider.get()[0])+offset),
						Math.min(_this.slider.noUiSlider.options.range.max,Number(_this.slider.noUiSlider.get()[1])+offset)
					];
					_this.slider.noUiSlider.set(newSet);
					updateChartFromSlider(_this);
				}else if (drag==false && _this.dbl && e.clientX){
					// if (!_this.dbl.direction || e.clientX*_this.dbl.direction<_this.dbl.startx*_this.dbl.direction){
						// _this.dbl.direction=Math.sign(e.clientX-_this.dbl.startx);
					// };
					// _this.dbl.ctx.save();
					// console.log("resore for dbl click")
					_this.dbl.ctx.putImageData(_this.dbl.save,0,0);
					// _this.chart.ctx.beginPath();
					// var eX=Math.max(Math.min(e.clientX,_this.chartArea.right+_this.dbl.canvasLeft),_this.chartArea.left+_this.dbl.canvasLeft)-_this.dbl.canvasLeft
					// _this.chart.ctx.moveTo(eX,_this.chartArea.top);
					// _this.chart.ctx.lineTo(eX,_this.chartArea.bottom);
					// _this.chart.ctx.strokeStyle="rgb(66,66,255)";
					// _this.chart.ctx.stroke();
					_this.chart.ctx.beginPath();
					_this.chart.ctx.fillStyle="rgba(66, 139, 202,0.3)";
					_this.chart.ctx.fillRect(Math.min(_this.chartArea.right,Math.max(_this.dbl.startx,_this.chartArea.left)), _this.chartArea.top, Math.min(_this.chartArea.right-_this.dbl.startx,Math.max(e.clientX-_this.dbl.startx-_this.dbl.canvasLeft,_this.chartArea.left-_this.dbl.startx)),_this.chartArea.bottom-_this.chartArea.top);
					_this.dbl.currentX=e.clientX-_this.dbl.canvasLeft;
					// _this.chart.ctx.restore();
					//-$("#"+_this.config.options.canvasId).offset().left
				};
			});
		};
	 },
	afterDraw:function(_this){
		// console.log('afterDraw');
		if (_this.dbl){
			_this.chart.ctx.beginPath();
			_this.chart.ctx.moveTo(_this.dbl.startx,_this.chartArea.top);
			_this.chart.ctx.lineTo(_this.dbl.startx,_this.chartArea.bottom);
			_this.chart.ctx.strokeStyle="rgb(66,66,255)";
				_this.chart.ctx.stroke();
			_this.chart.ctx.fillStyle="rgba(66, 139, 202,0.3)";
			_this.chart.ctx.fillRect(Math.min(_this.chartArea.right,Math.max(_this.dbl.startx,_this.chartArea.left)), _this.chartArea.top, Math.min(_this.chartArea.right-_this.dbl.startx,Math.max(_this.dbl.currentX-_this.dbl.startx,_this.chartArea.left-_this.dbl.startx)),_this.chartArea.bottom-_this.chartArea.top);
		};
	},
    afterDatasetsDraw: function(_this) {
		if (_this.$slider){
			console.log('afterDatasetsDraw');
			_this.$slider.css('margin-left',_this.chartArea.left);
			_this.$slider.css('width',_this.chartArea.right-_this.chartArea.left);
			_this.sliderSized=true;
		};
    },
	render:function(_this){
		// console.log('render');
		// _this.$slider.css('margin-left',_this.chartArea.left);
		// _this.$slider.css('width',_this.chartArea.right-_this.chartArea.left);
	},
	afterDatasetsUpdate:function(_this){
		// console.log('afterDatasetsUpdate');
		if (_this.previewChart){
			_this.previewChart.update();
		};
	},
	// resize:function(_this,newChartSize){
		// console.log('resize')
		// if (_this.$slider){
			// _this.$slider.css('width',_this.chartArea.right-_this.chartArea.left);
		// };
	// },
	destroy: function(chartInstance) {
		// console.log('destroy!');
		if (chartInstance.previewChart){
			chartInstance.previewChart.destroy()
		}
		if (chartInstance.slider){
			// console.log('destroy slider!!');
			chartInstance.slider.noUiSlider.destroy();
			$("#"+chartInstance.config.options.canvasId).unbind('touchstart.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('touchend.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('touchmove.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('mousedown.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('mouseup.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('mousemove.chart');
			$("#"+chartInstance.config.options.canvasId).unbind('dblclick.chart');
			$(document).unbind('keyup.chart');
		};
	
	}
});

Chart.prototype.addData = function(data,time){
	// console.log(this.parent);
	var _this = this.parent
	if (_this.config.options.scales.xAxes[0].type=="time"){
		dataset=chart;
		_this.config.data.labels.push(data.timeDate);
		if (_this.$previewChart.length>0){
			_this.previewChart.config.data.labels.push(data.timeDate);
		};
	}else{
		_this.config.data.labels.push(data.time);
		if (_this.$previewChart.length>0){
			_this.previewChart.config.data.labels.push(data.time);
		};
	};
	for (var i in _this.config.data.datasets){
		for (var j in data){
			if (j==_this.config.data.datasets[i].name){					
				_this.config.data.datasets[i].data.push(data[j]);
				if (_this.$previewChart.length>0){
				_this.previewChart.config.data.datasets[i].data.push(data[j]);
				};
			};				
		};			
	};
	if (_this.slider){
		// console.log("hanndle add data slider")
		var go=false;
		var diff;
		if (_this.config.options.scales.xAxes[0].type=="time"){			
			if (_this.slider.noUiSlider.get()[1]==_this.slider.noUiSlider.options.range.max){
				go=true;
				diff=_this.config.data.labels[_this.config.data.labels.length-1]-_this.config.data.labels[_this.config.data.labels.length-2];
			};
			_this.slider.noUiSlider.updateOptions({'range':{'min':_this.config.data.labels[0],'max':_this.config.data.labels[_this.config.data.labels.length-1]}})
			console.log(diff);
			if (go==true){
				console.log(Number(_this.slider.noUiSlider.get()[0])+diff);
				_this.slider.noUiSlider.set([Number(_this.slider.noUiSlider.get()[0])+diff,_this.config.data.labels[_this.config.data.labels.length-1]])
				_this.config.options.scales.xAxes[0].time.min=Number(_this.slider.noUiSlider.get()[0])+diff;
				_this.config.options.scales.xAxes[0].time.max =_this.config.data.labels[_this.config.data.labels.length-1];
				if(_this.$previewChart.length>0){
					_this.previewChart.config.options.scales.xAxes[0].time.max=_this.previewChart.config.data.labels[_this.previewChart.config.data.labels.length-1];
				};
			}
		}else{
			if (_this.slider.noUiSlider.get()[1]==_this.slider.noUiSlider.options.range.max){
				go=true;
			};
			_this.slider.noUiSlider.updateOptions({'range':{'min':0,'max':_this.config.data.labels.length-1}})
			_this.slider.noUiSlider.set([_this.slider.noUiSlider.get()[0]+1,_this.config.data.labels.length-1])
			if (go==true){
				_this.config.options.scales.xAxes[0].ticks.max=_this.config.data.labels[_this.config.data.labels.length-1];
				_this.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[Number(_this.slider.noUiSlider.get()[0])+1]
				// _this.previewChart.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[Number(_this.slider.noUiSlider.get()[0])+1];
				if(_this.$previewChart.length>0){
					_this.previewChart.config.options.scales.xAxes[0].ticks.max=_this.previewChart.config.data.labels[_this.previewChart.config.data.labels.length-1];
				};
			}
		};
	}else{
		if (_this.config.options.scales.xAxes[0].type=="time"){
			console.log(_this.config.data.labels[_this.config.data.labels.length-1]);
			_this.config.options.scales.xAxes[0].time.max =_this.config.data.labels[_this.config.data.labels.length-1];
			// _this.config.options.scales.xAxes[0].time.min =_this.config.data.labels[0];
			if(_this.$previewChart.length>0){
				_this.previewChart.config.options.scales.xAxes[0].time.max=_this.previewChart.config.data.labels[_this.previewChart.config.data.labels.length-1];
			};
		}else{
			_this.config.options.scales.xAxes[0].ticks.max=_this.config.data.labels[_this.config.data.labels.length-1];
			if(_this.$previewChart.length>0){
				_this.previewChart.config.options.scales.xAxes[0].ticks.max=_this.previewChart.config.data.labels[_this.previewChart.config.data.labels.length-1];
			};
			
		}
		
		// _this.update();
	}
	// console.log('Current chart data updated',_this.config.data.);
	console.log(_this.busy);
	if(_this.busy==false){
		// console.log('draw add');
		_this.busy=true;
		_this.update();
		_this.busy=false;
	}
}
Chart.prototype.removeData = function(n){
	var _this = this.parent
	for (var t=0;t<n;t++){
		_this.config.data.labels.shift();
		if(_this.$previewChart.length>0){
			_this.previewChart.config.data.labels.shift();
		};
		for (var i in _this.config.data.datasets){
			_this.config.data.datasets[i].data.shift();
			if (_this.$previewChart.length>0){
				_this.previewChart.config.data.datasets[i].data.shift();
			};
		};
	};
	if (_this.slider){	
		if (_this.config.options.scales.xAxes[0].type=="time"){
			var go=false;
			if (_this.slider.noUiSlider.get()[0]==_this.slider.noUiSlider.options.range.min){
				go=true;
			};
			// console.log(go)
			_this.slider.noUiSlider.updateOptions({'range':{'min':_this.config.data.labels[0],'max':_this.config.data.labels[_this.config.data.labels.length-1]}})
			
			if (go==true){
				_this.slider.noUiSlider.set([_this.config.data.labels[0],_this.slider.noUiSlider.get()[1]])	
				_this.config.options.scales.xAxes[0].time.min=_this.config.data.labels[0];
				
			}
			_this.previewChart.config.options.scales.xAxes[0].time.min=_this.previewChart.config.data.labels[0];
		}else{
			var go=false;
			if (_this.slider.noUiSlider.get()[0]==_this.slider.noUiSlider.options.range.min){go=true;};
				
			_this.slider.noUiSlider.updateOptions({'range':{'min':0,'max':_this.config.data.labels.length-1}})
			_this.slider.noUiSlider.set(_this.config.data.labels[0],_this.slider.noUiSlider.get()[1])
			if (go==true){
				_this.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[0];
			}
		}
	}else{
		
		if (_this.config.options.scales.xAxes[0].type=="time"){	
			_this.config.options.scales.xAxes[0].time.min=_this.config.data.labels[0];
			// _this.config.options.scales.xAxes[0].time.max =_this.config.data.labels[_this.config.data.labels.length-1];
			if(_this.$previewChart.length>0){
				_this.previewChart.config.options.scales.xAxes[0].time.min=_this.previewChart.config.data.labels[0];
			};
		}else{
			_this.config.options.scales.xAxes[0].ticks.min=_this.config.data.labels[0];
			if(_this.$previewChart.length>0){
				_this.previewChart.config.options.scales.xAxes[0].ticks.min=_this.previewChart.config.data.labels[_this.previewChart.config.data.labels.length-1];
			};
		}
	};
	if(_this.busy==false){
		// console.log('draw remove');
		_this.busy=true;
		_this.update();
		_this.busy=false;
	}
};
Chart.prototype.updateData = function(data){
	var _this=this.parent;
	// console.log(_this);
	for (var i in _this.config.data.datasets){
		for (var j in data){
			if (j==_this.config.data.datasets[i].name){					
				_this.config.data.datasets[i].data = data[j];
				if (_this.$previewChart.length>0){
					_this.previewChart.config.data.datasets[i].data = data[j];
				};
			};				
		};			
	};
	if(_this.busy==false){
		console.log('draw update');
		_this.busy=true;
		_this.update();
		_this.busy=false;
	}
};

// test = function(){
	// console.log('test');
// }
homeCharts = function(canvasId,configSet,chart,dataset){
	// console.log("new home charts")
	this.configSet=configSet;
	this.canvasId=canvasId;
	this.chart='temperatures';
	this.chart=chart;
	this.dataset='temperatures';
	this.dataset=dataset;
	// console.log(this);
	if(!this.ctx){
		this.ctx = document.getElementById(canvasId).getContext("2d");	
	};
	var c = $.extend(true, {}, this.configSet[chart][dataset]);
	c.options.canvasId=canvasId;	
	this.currentChart = new Chart(this.ctx, c);
};
homeCharts.prototype.changeChart = function(chart,dataset){
	this.chart=chart;
	this.dataset=dataset;
	this.currentChart.destroy();
	
	var c = $.extend(true, {}, this.configSet[chart][dataset]); 
	c.options.canvasId=this.canvasId;
	// this.currentChart = new homeChart(this.canvasId, c);
	this.currentChart = new Chart(this.ctx, c);
};
 
homeCharts.prototype.addData = function(chart,dataset,data){
	if (this.configSet[chart][dataset].options.scales.xAxes[0].type=="time"){
		dataset=chart;
		this.configSet[chart][dataset].data.labels.push(data.timeDate);
	}else{
		this.configSet[chart][dataset].data.labels.push(data.time);
	};
	for (var i in this.configSet[chart][dataset].data.datasets){
		for (var j in data){
			if (j==this.configSet[chart][dataset].data.datasets[i].name){					
				this.configSet[chart][dataset].data.datasets[i].data.push(data[j]);
			};				
		};			
	};
	// console.log('data updated',chart,this.chart,dataset,this.dataset)
	if (chart==this.chart && dataset==this.dataset){
		this.currentChart.chart.addData(data);
	};
};
homeCharts.prototype.removeData = function(chart,dataset,n){

	for (var t=0;t<n;t++){
		this.configSet[chart][dataset].data.labels.shift();
		// this.configSetPreview[chart][dataset].data.labels.shift();
		for (var i in configSet[chart][dataset].data.datasets){
			this.configSet[chart][dataset].data.datasets[i].data.shift();
			// this.configSetPreview[chart][dataset].data.datasets[i].data.shift();
		};
	};
	if (chart==this.chart && dataset==this.dataset){
		this.currentChart.chart.removeData(n);
	};
};
homeCharts.prototype.updateData = function (chart,dataset,data){
	for (var i in this.configSet[chart][dataset].data.datasets){
		for (var j in data){
			if (j==configSet[chart][dataset].data.datasets[i].name){					
				configSet[chart][dataset].data.datasets[i].data = data[j];
			};				
		};			
	};	
	if (chart==this.chart && dataset==this.dataset){

		this.currentChart.chart.updateData(data);
	};
};
