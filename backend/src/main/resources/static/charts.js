// Advanced Chart Library using Canvas API
const Charts = {
    // Draw Bar Chart
    drawBarChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = options.width || 600;
        const height = canvas.height = options.height || 300;
        const padding = options.padding || 40;
        
        ctx.clearRect(0, 0, width, height);
        
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.length - 10;
        const maxValue = Math.max(...data.map(d => d.value));
        
        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + 10) + 5;
            const y = height - padding - barHeight;
            
            // Gradient fill
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, item.color || '#3b82f6');
            gradient.addColorStop(1, this.lightenColor(item.color || '#3b82f6', 40));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Value label
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.value, x + barWidth / 2, y - 5);
            
            // X-axis label
            ctx.fillStyle = '#6b7280';
            ctx.font = '11px Arial';
            ctx.save();
            ctx.translate(x + barWidth / 2, height - padding + 15);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText(item.label, 0, 0);
            ctx.restore();
        });
        
        // Title
        if (options.title) {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
    },
    
    // Draw Pie Chart
    drawPieChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = options.width || 400;
        const height = canvas.height = options.height || 300;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2 - 20;
        const radius = Math.min(width, height) / 3;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;
        
        // Draw slices
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = item.color || this.getColor(index);
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Percentage label
            const midAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);
            
            const percentage = ((item.value / total) * 100).toFixed(1);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(percentage + '%', labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Legend
        const legendX = 20;
        let legendY = height - data.length * 25 - 10;
        
        data.forEach((item, index) => {
            ctx.fillStyle = item.color || this.getColor(index);
            ctx.fillRect(legendX, legendY, 15, 15);
            
            ctx.fillStyle = '#1f2937';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${item.label}: ${item.value}`, legendX + 20, legendY + 12);
            
            legendY += 25;
        });
        
        // Title
        if (options.title) {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
    },
    
    // Draw Line Chart
    drawLineChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = options.width || 600;
        const height = canvas.height = options.height || 300;
        const padding = options.padding || 50;
        
        ctx.clearRect(0, 0, width, height);
        
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const range = maxValue - minValue || 1;
        
        // Draw grid
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            
            // Y-axis labels
            const value = maxValue - (range / 5) * i;
            ctx.fillStyle = '#6b7280';
            ctx.font = '11px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(value), padding - 10, y + 4);
        }
        
        // Draw axes
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Draw line with gradient
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
        
        ctx.beginPath();
        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const normalizedValue = (item.value - minValue) / range;
            const y = height - padding - normalizedValue * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        // Fill area under line
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const normalizedValue = (item.value - minValue) / range;
            const y = height - padding - normalizedValue * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw points
        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const normalizedValue = (item.value - minValue) / range;
            const y = height - padding - normalizedValue * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#3b82f6';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // X-axis labels
            ctx.fillStyle = '#6b7280';
            ctx.font = '11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x, height - padding + 20);
        });
        
        // Title
        if (options.title) {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
    },
    
    // Draw Donut Chart
    drawDonutChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = options.width || 400;
        const height = canvas.height = options.height || 300;
        
        ctx.clearRect(0, 0, width, height);
        
        const centerX = width / 2;
        const centerY = height / 2 - 20;
        const outerRadius = Math.min(width, height) / 3;
        const innerRadius = outerRadius * 0.6;
        
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = -Math.PI / 2;
        
        // Draw slices
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
            ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
            ctx.closePath();
            
            ctx.fillStyle = item.color || this.getColor(index);
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
        });
        
        // Center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Center text
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total, centerX, centerY - 10);
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Total', centerX, centerY + 15);
        
        // Legend
        const legendX = 20;
        let legendY = height - data.length * 25 - 10;
        
        data.forEach((item, index) => {
            ctx.fillStyle = item.color || this.getColor(index);
            ctx.fillRect(legendX, legendY, 15, 15);
            
            ctx.fillStyle = '#1f2937';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${item.label}: ${item.value}`, legendX + 20, legendY + 12);
            
            legendY += 25;
        });
        
        // Title
        if (options.title) {
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(options.title, width / 2, 20);
        }
    },
    
    // Helper: Get color from palette
    getColor(index) {
        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
            '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
        ];
        return colors[index % colors.length];
    },
    
    // Helper: Lighten color
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
};
